import { Clue } from "./clue-api";


class ClueApiService {
    public readonly CLUE_API_URL = process.env.CLUE_API_URL;

    private readonly QUESTION_REGEX =
        /^(what is|what are|whats|what's|where is|where are|wheres|where's|who is|who are|whos|who's|when is|when are|whens|when's|why is|why are|whys|why's) /i;
    private readonly numberFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    })
    private readonly dateFormatter = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
    })

    public isQuestionFormat(userResponse: string): boolean {
        const matches = userResponse
            .replace(/[^\w\s]/i, "")
            .match(this.QUESTION_REGEX);
        return Boolean(matches);

    }

    public formatClue(clue: Clue): string {
        const clueDate = this.dateFormatter.format(new Date(clue.airdate));
        return `(${clueDate}) The category is **${clue.category.toLocaleUpperCase()}** for $${clue.value
            }:\n\`\`\`${clue.clue}\`\`\``;
    }
}

export const clueApiService: ClueApiService = new ClueApiService();