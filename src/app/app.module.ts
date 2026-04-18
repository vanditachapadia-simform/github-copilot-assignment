import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

import { AppComponent } from "./app.component";
import { UserProfileComponent } from "../components/user-profile/user-profile.component";
import { UserListComponent } from "../components/user-list/user-list.component";

@NgModule({
    declarations: [AppComponent, UserProfileComponent, UserListComponent],
    imports: [BrowserModule, CommonModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
