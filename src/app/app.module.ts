import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { UserProfileComponent } from "../components/user-profile/user-profile.component";
import { UserListComponent } from "../components/user-list/user-list.component";
import { ActivityDashboardComponent } from "../components/activity-dashboard/activity-dashboard.component";

@NgModule({
    declarations: [
        AppComponent, 
        UserProfileComponent, 
        UserListComponent, 
        ActivityDashboardComponent
    ],
    imports: [
        BrowserModule, 
        CommonModule, 
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
