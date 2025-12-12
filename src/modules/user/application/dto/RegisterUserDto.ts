export interface RegisterUserDto {
    name: string;
    email: string;
    password: string;
}

export interface RegisterUserResponseDto {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}