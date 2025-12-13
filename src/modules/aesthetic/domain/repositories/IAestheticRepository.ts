import { Aesthetic } from "../entities/Aeshtetic";

export interface IAestheticRepository {
    save(aesthetic: Aesthetic): Promise<Aesthetic>;
    findById(id: string): Promise<Aesthetic | null>;
    findByName(name: string): Promise<Aesthetic | null>;
    findAll(): Promise<Aesthetic[]>;
    update(aesthetic: Aesthetic): Promise<Aesthetic>;
    delete(id: string): Promise<void>;
    existsByName(name: string): Promise<boolean>;
    searchByKeyword(keyword: string): Promise<Aesthetic[]>;
}