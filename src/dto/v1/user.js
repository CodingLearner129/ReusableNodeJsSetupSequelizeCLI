import { getImage } from './../../services/v1/commonService.js';

export class UserLogInDTO {
    constructor(user) {
        this.first_name = user.first_name ?? "";
        this.last_name = user.last_name ?? "";
        this.full_name = user.full_name ?? "";
        this.email = user.email ?? "";
        this.image = getImage(user.image);
        if (user.accessToken) {
            this.accessToken = user.accessToken ?? "";
        }
        // this.refreshToken = user.refreshToken ?? "";
    }
}

export class UserProfileDTO {
    constructor(user) {
        this.first_name = user.first_name ?? "";
        this.last_name = user.last_name ?? "";
        this.full_name = user.full_name ?? "";
        this.email = user.email ?? "";
        this.image = getImage(user.image);
        this.created_at = user.created_at ?? 0;
        this.updated_at = user.updated_at ?? 0;
        this.deleted_at = user.deleted_at ?? 0;
    }
}

export class UsersListDTO {
    constructor(users) {
        return users.map(user => {
            return {
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                full_name: user.full_name ?? "",
                email: user.email ?? "",
                image: getImage(user.image),
                created_at: user.created_at ?? 0,
                updated_at: user.updated_at ?? 0,
                deleted_at: user.deleted_at ?? 0
            }
        })
    }
}

export class GetUserDTO {
    constructor(user) {
        this.id = user.id;
        this.first_name = user.first_name ?? "";
        this.last_name = user.last_name ?? "";
        this.full_name = user.full_name ?? "";
        this.email = user.email ?? "";
        this.image = getImage(user.image);
        this.created_at = user.created_at ?? 0;
        this.updated_at = user.updated_at ?? 0;
        this.deleted_at = user.deleted_at ?? 0;
    }
}