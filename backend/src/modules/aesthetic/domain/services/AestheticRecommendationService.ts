import { Aesthetic } from "../entities/Aeshtetic";
import { AestheticScore } from '../value-objects/AestheticScore';

export interface ProductAestheticMatch {
    productId: string;
    aestheticId: string;
    score: AestheticScore;
}

export class AestheticRecommendationService {
    // Map of related aesthetics for cross-matching
    private readonly aestheticRelationships: Record<string, string[]> = {
        'minimalist': ['normcore', 'athleisure', 'coastal-grandmother', 'old-money'],
        'streetwear': ['skater', 'grunge', 'techwear', 'y2k'],
        'cottagecore': ['romantic-academia', 'balletcore', 'bohemian', 'soft-girl'],
        'athleisure': ['minimalist', 'gorpcore', 'techwear', 'normcore'],
        'dark-academia': ['romantic-academia', 'old-money', 'vintage-americana'],
        'y2k': ['soft-girl', 'streetwear', 'cyberpunk'],
        'bohemian': ['cottagecore', 'gorpcore', 'romantic-academia'],
        'grunge': ['streetwear', 'skater', 'vintage-americana'],
        'coastal-grandmother': ['minimalist', 'old-money', 'bohemian'],
        'gorpcore': ['athleisure', 'techwear', 'vintage-americana'],
        'old-money': ['dark-academia', 'coastal-grandmother', 'minimalist'],
        'cyberpunk': ['techwear', 'streetwear', 'y2k', 'avant-garde'],
        'soft-girl': ['cottagecore', 'balletcore', 'y2k', 'romantic-academia'],
        'avant-garde': ['cyberpunk', 'techwear', 'bohemian'],
        'vintage-americana': ['dark-academia', 'grunge', 'gorpcore'],
        'balletcore': ['soft-girl', 'romantic-academia', 'cottagecore'],
        'normcore': ['minimalist', 'athleisure', 'coastal-grandmother'],
        'techwear': ['cyberpunk', 'gorpcore', 'athleisure', 'streetwear'],
        'romantic-academia': ['dark-academia', 'cottagecore', 'balletcore'],
        'skater': ['streetwear', 'grunge', 'vintage-americana'],
    };

    public calculateProductMatch(
        productAestheticTags: string[],
        userAesthetic: Aesthetic
    ): AestheticScore {
        if (!productAestheticTags || productAestheticTags.length === 0) {
            return new AestheticScore(0);
        }

        // Normalize aesthetic name for matching
        const normalizedUserAesthetic = this.normalizeAestheticName(userAesthetic.name);

        // Check if user's aesthetic is in product tags (direct match)
        const hasDirectMatch = productAestheticTags.some(
            tag => this.normalizeAestheticName(tag) === normalizedUserAesthetic
        );
        if (hasDirectMatch) {
            return new AestheticScore(100);
        }

        // Check for related aesthetic match
        const relatedAesthetics = this.aestheticRelationships[normalizedUserAesthetic] || [];
        const hasRelatedMatch = productAestheticTags.some(tag =>
            relatedAesthetics.includes(this.normalizeAestheticName(tag))
        );
        if (hasRelatedMatch) {
            return new AestheticScore(75); // High score for related aesthetics
        }

        // Calculate similarity based on theme properties
        const productKeywords = this.extractKeywordsFromTags(productAestheticTags);
        const aestheticKeywords = userAesthetic.themeProperties.getKeywords();
        const aestheticColors = userAesthetic.themeProperties.getColors();
        const aestheticStyle = userAesthetic.themeProperties.getStyle();

        let matchScore = 0;
        let totalPossibleScore = 0;

        // Keyword matching (40% weight)
        if (aestheticKeywords.length > 0 && productKeywords.length > 0) {
            const keywordMatches = productKeywords.filter((keyword) =>
                aestheticKeywords.some((ak: string) => ak.toLowerCase() === keyword.toLowerCase())
            );
            const keywordScore = (keywordMatches.length / aestheticKeywords.length) * 40;
            matchScore += keywordScore;
            totalPossibleScore += 40;
        }

        // Style matching (30% weight)
        const hasStyleMatch = productKeywords.some(
            (keyword) => keyword.toLowerCase() === aestheticStyle.toLowerCase()
        );
        if (hasStyleMatch) {
            matchScore += 30;
        }
        totalPossibleScore += 30;

        // Color matching (30% weight)
        if (aestheticColors.length > 0 && productKeywords.length > 0) {
            const colorMatches = productKeywords.filter((keyword) =>
                aestheticColors.some((color: string) =>
                    keyword.toLowerCase().includes(color.toLowerCase()) ||
                    color.toLowerCase().includes(keyword.toLowerCase())
                )
            );
            const colorScore = colorMatches.length > 0 ? 30 : 0;
            matchScore += colorScore;
            totalPossibleScore += 30;
        }

        const finalScore = totalPossibleScore > 0 ? (matchScore / totalPossibleScore) * 100 : 0;
        return new AestheticScore(Math.round(finalScore));
    }

    public rankProducts(
        products: Array<{ id: string; aestheticTags: string[] }>,
        userAesthetic: Aesthetic
    ): ProductAestheticMatch[] {
        const matches: ProductAestheticMatch[] = products.map((product) => ({
            productId: product.id,
            aestheticId: userAesthetic.id,
            score: this.calculateProductMatch(product.aestheticTags, userAesthetic),
        }));

        // Sort by score descending
        return matches.sort((a, b) => {
            if (a.score.isGreaterThan(b.score)) return -1;
            if (b.score.isGreaterThan(a.score)) return 1;
            return 0;
        });
    }

    public filterByMinimumScore(
        matches: ProductAestheticMatch[],
        minimumScore: number
    ): ProductAestheticMatch[] {
        return matches.filter((match) => match.score.getValue() >= minimumScore);
    }

    public getHighMatchProducts(
        matches: ProductAestheticMatch[]
    ): ProductAestheticMatch[] {
        return matches.filter((match) => match.score.isHighMatch());
    }

    public getMediumMatchProducts(
        matches: ProductAestheticMatch[]
    ): ProductAestheticMatch[] {
        return matches.filter((match) => match.score.isMediumMatch());
    }

    private normalizeAestheticName(name: string): string {
        return name.toLowerCase().replaceAll(/\s+/g, '-');
    }

    private extractKeywordsFromTags(tags: string[]): string[] {
        // In a real implementation, this would map tag IDs to actual aesthetic data
        // For now, we'll return the tags themselves as keywords
        return tags.map(tag => this.normalizeAestheticName(tag));
    }
}