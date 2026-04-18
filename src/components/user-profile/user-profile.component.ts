/**
 * UserProfileComponent
 *
 * A presentational (dumb) component that displays a user's profile card.
 * This file lives under src/components/ and therefore follows BOTH:
 *   1. General rules   — .github/copilot-instructions.md
 *   2. Frontend rules  — .github/instructions/frontend.instructions.md
 *
 * Frontend-specific rules demonstrated:
 *   - OnPush change detection for performance
 *   - @Input() / @Output() with strict TypeScript interfaces
 *   - Small, focused, presentational component (no service injection)
 *   - kebab-case file name with `.component.ts` suffix
 *   - Separate HTML, CSS, and TS files
 *   - Accessible template with aria attributes
 *   - trackBy used for *ngFor list rendering
 *
 * General rules demonstrated:
 *   - PascalCase class/interface names, camelCase variables
 *   - JSDoc comments on the public API
 *   - No use of `any`; all types are explicit
 *   - Single-responsibility — this component only renders a profile card
 */

import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
} from "@angular/core";

// ── Data Model (demonstrates strict typing — frontend rule #3) ───────────────

/** Represents a single skill tag on a user's profile. */
export interface UserSkill {
    id: number;
    label: string;
}

/** Shape of the data this component expects via @Input(). */
export interface UserProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    role: UserRole;
    isActive: boolean;
    skills: UserSkill[];
}

/** Fixed set of roles — union type preferred over loose strings. */
export type UserRole = "admin" | "editor" | "viewer";

// ── Component ────────────────────────────────────────────────────────────────

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
    /**
     * The user profile data to render.
     * Strict typing ensures the parent component supplies all required fields.
     */
    @Input({ required: true })
    profile!: UserProfile;

    /** Emitted when the "View Details" button is clicked. */
    @Output()
    viewDetails = new EventEmitter<number>();

    /** Emitted when the "Contact" button is clicked. */
    @Output()
    contact = new EventEmitter<number>();

    /**
     * trackBy function for the skills *ngFor.
     * Returning a stable identifier lets Angular skip unnecessary DOM updates.
     */
    trackBySkillId(_index: number, skill: UserSkill): number {
        return skill.id;
    }

    /** Delegates the "view details" action to the parent via @Output(). */
    onViewDetails(): void {
        this.viewDetails.emit(this.profile.id);
    }

    /** Delegates the "contact" action to the parent via @Output(). */
    onContact(): void {
        this.contact.emit(this.profile.id);
    }
}
