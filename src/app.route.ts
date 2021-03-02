import { Routes } from "nest-router";
import { LoanProfileModule } from "./modules";
import {MasterDataModule} from "./modules/master-data/master-data.module";

export const ROUTES: Routes = [
  {
    path: "/api/mafc",
    children: [MasterDataModule, LoanProfileModule]
  }
];
