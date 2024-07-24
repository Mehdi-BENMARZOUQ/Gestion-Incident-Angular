import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DevisService } from "../../../service/devis.service";
import { DevisModel } from "../../../model/devis.model";
import { FactureService } from "../../../service/facture.service";
import { TechnicienService } from "../../../service/technicien.service";
import { AgenceService } from "../../../service/agence.service";
import { FactureModel } from "../../../model/facture.model";
import { AgenceModel } from "../../../model/agence.model";
import { TechnicienModel } from "../../../model/technicien.model";

interface AgencyDevisPercentage {
    agencyName: string;
    percentage: number;
}

interface TechnicienDevisPercentage {
    techName: string;
    percentage: number;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    deviss: DevisModel[] = [];
    agencyDevisPercentages: AgencyDevisPercentage[] = [];
    techDevisPercentages: TechnicienDevisPercentage[] = [];
    lineData: any;
    barData: any;
    barOptions: any;
    items!: MenuItem[];
    products!: Product[];
    numberOfDevis: number = 0;
    numberOfFacture: number = 0;
    numberOfTechnicien: number = 0;
    numberOfAgence: number = 0;
    numberOfDevisLast30Days: number = 0;
    numberOfFactureLast30Days: number = 0;
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    primaryColor:string = "--primary-500";

    constructor(
        private devisService: DevisService,
        private factureService: FactureService,
        private technicienService: TechnicienService,
        private agenceService: AgenceService,
        private productService: ProductService,
        public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart({ rejected: [], notRejected: [] });
            });
    }

    ngOnInit() {
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.getNumberOfTechnicien();
        this.getNumberOfDevis();
        this.getNumberOfAgence();
        this.getNumberOfFacture();
        this.getNumberOfDevisBasedOnDate();
        this.getNumberOfFactureBasedOnDate();

    }

    initChart(devisData: { rejected: number[], notRejected: number[] }) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const monthlyFactures = this.getMonthlyFactureData();
        const monthlyDevis = devisData.rejected.map((v, i) => v + devisData.notRejected[i]);

        this.chartData = {
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            datasets: [
                {
                    label: 'Rejected',
                    data: devisData.rejected,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: .4
                },
                {
                    label: 'Not Rejected',
                    data: devisData.notRejected,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        this.barData = {
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            datasets: [
                {
                    label: 'Facture',
                    data: monthlyFactures,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    fill: false,
                },
                {
                    label: 'Devis',
                    data: monthlyDevis,
                    backgroundColor: documentStyle.getPropertyValue('--primary-200'),
                    borderColor: documentStyle.getPropertyValue('--primary-200'),
                    fill: false,
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getNumberOfDevis(): void {
        this.devisService.getDevis().subscribe(
            (devis: DevisModel[]) => {
                this.numberOfDevis = devis.length;
                this.deviss = devis;
                this.calculateAgencyDevisPercentages();
                this.calculateTechnicienDevisPercentages();
            },
            (error) => {
                console.error('Failed to fetch devis count:', error);
            }
        );
    }

    getNumberOfFacture(): void {
        this.factureService.getFactures().subscribe(
            (facture: FactureModel[]) => {
                this.numberOfFacture = facture.length;
            },
            (error) => {
                console.error('Failed to fetch facture count:', error);
            }
        );
    }

    getNumberOfAgence(): void {
        this.agenceService.getAgences().subscribe(
            (agence: AgenceModel[]) => {
                this.numberOfAgence = agence.length;
            },
            (error) => {
                console.error('Failed to fetch agence count:', error);
            }
        );
    }

    getNumberOfTechnicien(): void {
        this.technicienService.getTechniciens().subscribe(
            (technicien: TechnicienModel[]) => {
                this.numberOfTechnicien = technicien.length;
            },
            (error) => {
                console.error('Failed to fetch technicien count:', error);
            }
        );
    }

    private isWithinLast30Days(date: Date): boolean {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
        return new Date(date) >= thirtyDaysAgo;
    }

    getNumberOfDevisBasedOnDate(): void {
        this.devisService.getDevis().subscribe(
            (devis: DevisModel[]) => {
                const filteredDevis = devis.filter(d => this.isWithinLast30Days(d.date));
                this.numberOfDevisLast30Days = filteredDevis.length;
                this.updateChartData(devis);
            },
            (error) => {
                console.error('Failed to fetch devis count:', error);
            }
        );
    }

    getNumberOfFactureBasedOnDate(): void {
        this.factureService.getFactures().subscribe(
            (factures: FactureModel[]) => {
                const filteredFactures = factures.filter(f => this.isWithinLast30Days(f.date_traitement));
                this.numberOfFactureLast30Days = filteredFactures.length;
            },
            (error) => {
                console.error('Failed to fetch facture count:', error);
            }
        );
    }

    private updateChartData(devis: DevisModel[]): void {
        const months = Array.from({ length: 12 }, () => ({ rejected: 0, notRejected: 0 }));

        devis.forEach(d => {
            const month = new Date(d.date!).getMonth();
            if (d.rejected) {
                months[month].rejected++;
            } else {
                months[month].notRejected++;
            }
        });

        const rejectedData = months.map(m => m.rejected);
        const notRejectedData = months.map(m => m.notRejected);

        this.initChart({ rejected: rejectedData, notRejected: notRejectedData });
    }

    private getMonthlyFactureData(): number[] {
        const monthlyCounts = Array(12).fill(0);

        this.factureService.getFactures().subscribe(
            (factures: FactureModel[]) => {
                factures.forEach(f => {
                    const month = new Date(f.date_traitement).getMonth();
                    monthlyCounts[month]++;
                });
            },
            (error) => {
                console.error('Failed to fetch facture data:', error);
            }
        );

        return monthlyCounts;
    }

    calculateAgencyDevisPercentages(): void {
        const agencyDevisCount: { [key: string]: number } = {};
        this.deviss.forEach(devis => {
            const agencyName = devis.agence.nom;
            if (agencyDevisCount[agencyName]) {
                agencyDevisCount[agencyName]++;
            } else {
                agencyDevisCount[agencyName] = 1;
            }
        });

        const totalDevis = this.deviss.length;
        this.agencyDevisPercentages = Object.keys(agencyDevisCount).map(agencyName => ({
            agencyName,
            percentage: (agencyDevisCount[agencyName] / totalDevis) * 100
        }));
    }
    calculateTechnicienDevisPercentages(): void {
        const techDevisCount: { [key: string]: number } = {};
        this.deviss.forEach(devis => {
            const techName = devis.technicien.nom;
            if (techDevisCount[techName]) {
                techDevisCount[techName]++;
            } else {
                techDevisCount[techName] = 1;
            }
        });

        const totalDevis = this.deviss.length;
        this.techDevisPercentages = Object.keys(techDevisCount).map(techName => ({
            techName,
            percentage: (techDevisCount[techName] / totalDevis) * 100
        }));
    }





}
