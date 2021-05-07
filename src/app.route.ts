import { Routes } from "nest-router";
import { LoanProfileModule, SaleGroupModule } from "./modules";
import { MasterDataModule } from "./modules/master-data/master-data.module";
import { ReceiveResultModule } from "./modules/receive-result/receive-result.module";
import { PtfLoanProfileModule } from "./modules/ptf/ptf-loan-profile/ptf-loan-profile.module";
import { PtfMasterDataModule } from "./modules/ptf/ptf-master-data/ptf-master-data.module";
import { PtfReceiveResultModule } from "./modules/ptf/ptf-receive-result/ptf-receive-result.module";

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
      PtfMasterDataModule,
      PtfLoanProfileModule,
      PtfReceiveResultModule
    ]
  }
];
