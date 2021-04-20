import { Routes } from "nest-router";
import { LoanProfileModule, SaleGroupModule } from "./modules";
import { MasterDataModule } from "./modules/master-data/master-data.module";
import { ReceiveResultModule } from "./modules/receive-result/receive-result.module";
import {PtfLoanProfileModule} from "./modules/ptf/ptf-loan-profile/ptf-loan-profile.module";

export const ROUTES: Routes = [
    {
        path: "/api/mafc",
        children: [
            MasterDataModule,
            LoanProfileModule,
            ReceiveResultModule,
            SaleGroupModule
        ]
    },
    {
        path: "/api/ptf",
        children: [
            PtfLoanProfileModule
        ]
    },
];
