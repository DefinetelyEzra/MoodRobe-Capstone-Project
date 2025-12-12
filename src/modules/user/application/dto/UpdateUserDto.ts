export interface UpdateUserDto {
    name?: string;
    email?: string;
}

export interface UpdateUserResponseDto {
    id: string;
    name: string;
    email: string;
    selectedAestheticId?: string;
    updatedAt: Date;
}