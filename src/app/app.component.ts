import { Component } from "@angular/core";
import { UserProfile } from "../components/user-profile/user-profile.component";
import { capitalize, slugify, truncate } from "../utils/string-utils";

/**
 * Root Application Component
 *
 * Demonstrates both instruction scopes:
 *   - Uses the backend string-utils (general rules)
 *   - Renders the UserProfileComponent (general + frontend rules)
 */
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent {
    /** Results from the backend string-utils (general rules only). */
    capitalizeResult: string;
    slugifyResult: string;
    truncateResult: string;

    /** Sample user data for the frontend component demo. */
    sampleUsers: UserProfile[] = [
        {
            id: 1,
            firstName: "Ananya",
            lastName: "Sharma",
            email: "ananya@example.com",
            avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Ananya",
            role: "admin",
            isActive: true,
            skills: [
                { id: 1, label: "Angular" },
                { id: 2, label: "TypeScript" },
                { id: 3, label: "RxJS" },
            ],
        },
        {
            id: 2,
            firstName: "Ravi",
            lastName: "Patel",
            email: "ravi@example.com",
            avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Ravi",
            role: "editor",
            isActive: true,
            skills: [
                { id: 4, label: "Node.js" },
                { id: 5, label: "GraphQL" },
            ],
        },
        {
            id: 3,
            firstName: "Maya",
            lastName: "Chen",
            email: "maya@example.com",
            avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Maya",
            role: "viewer",
            isActive: false,
            skills: [
                { id: 6, label: "CSS" },
                { id: 7, label: "Design" },
                { id: 8, label: "Figma" },
            ],
        },
    ];

    /** Log of emitted events from the profile cards. */
    eventLog: string[] = [];

    constructor() {
        // Demonstrate the backend string utilities (general rules only)
        this.capitalizeResult = capitalize("hello world");
        this.slugifyResult = slugify("Hello World! Angular Demo");
        this.truncateResult = truncate(
            "The quick brown fox jumps over the lazy dog",
            20,
        );
    }

    /** trackBy for *ngFor over user profiles — general rule: performance. */
    trackByUserId(_index: number, user: UserProfile): number {
        return user.id;
    }

    /** Handles viewDetails event from UserProfileComponent. */
    onViewDetails(userId: number): void {
        const user = this.sampleUsers.find((u) => u.id === userId);
        if (user) {
            this.eventLog.unshift(
                `🔍 View Details clicked for ${user.firstName} ${user.lastName}`,
            );
        }
    }

    /** Handles contact event from UserProfileComponent. */
    onContact(userId: number): void {
        const user = this.sampleUsers.find((u) => u.id === userId);
        if (user) {
            this.eventLog.unshift(
                `✉️ Contact clicked for ${user.firstName} ${user.lastName}`,
            );
        }
    }
}
