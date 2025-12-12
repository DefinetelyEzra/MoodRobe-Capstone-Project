export interface LoginUserDto {
    email: string;
    password: string;
}

export interface LoginUserResponseDto {
    user: {
        id: string;
        name: string;
        email: string;
        selectedAestheticId?: string;
    };
    token: string;
}