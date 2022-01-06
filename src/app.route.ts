import { Routes } from "nest-router";
import { LoanProfileModule, SaleGroupModule } from "./modules";
import { MasterDataModule } from "./modules/mafc/master-data/master-data.module";
import { ReceiveResultModule } from "./modules/mafc/receive-result/receive-result.module";
import { PtfLoanProfileModule } from "./modules/ptf/ptf-loan-profile/ptf-loan-profile.module";
import { PtfMasterDataModule } from "./modules/ptf/ptf-master-data/ptf-master-data.module";
import { PtfReceiveResultModule } from "./modules/ptf/ptf-receive-result/ptf-receive-result.module";
import { McLoanProfileModule } from "./modules/mc/mc-loan-profile/mc-loan-profile.module";
import { McKiosModule } from "./modules/mc/mc-kios/mc-kios.module";
import { McProductModule } from "./modules/mc/mc-product/mc-product.module";
import { McCicresultModule } from "./modules/mc/mc-cicresult/mc-cicresult.module";
import { McCaseModule } from "./modules/mc/mc-case/mc-case.module";
import { McCaseNoteModule } from "./modules/mc/mc-case-note/mc-case-note.module";
import { McNotificationModule } from "./modules/mc/mc-notification/mc-notification.module";
import { McAttachfileModule } from "./modules/mc/mc-attachfile/mc-attachfile.module";
import { PartnerLoanProfileModule } from "./modules/partner/partner-loan-profile/partner-loan-profile.module";
import { McScoringTrackingModule } from "./modules/mc/mc-scoring-tracking/mc-scoring-tracking.module";

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
  },
  {
    path: "/api/mc",
    children: [
      McLoanProfileModule,
      McKiosModule,
      McProductModule,
      McCicresultModule,
      McCaseModule,
      McCaseNoteModule,
      McNotificationModule,
      McAttachfileModule,
      McScoringTrackingModule
    ]
  },
  {
    path: "api/partner",
    children: [PartnerLoanProfileModule]
  }
];
