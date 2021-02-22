import { Routes } from "nest-router";
import { LoanProfileModule } from "./modules";

export const ROUTES: Routes = [
  {
    path: "/api/mafc",
    children: [LoanProfileModule]
  }
];
