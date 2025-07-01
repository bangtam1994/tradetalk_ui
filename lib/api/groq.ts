import { Trade, JournalEntry } from '@/types/trading';

export const analyzeTradingDay = async (
  trades: Trade[],
  journal: JournalEntry | null
) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_AI_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content:
              "Tu es un coach de trading sympa et direct. Tu parles comme un ami qui connaît bien le trading. Tu donnes des conseils pratiques sans être trop formel. Tu restes professionnel mais avec une touche d'humour. Tu évites les phrases longues et complexes.",
          },
          {
            role: 'user',
            content: `Analysez ces trades du point de vue technique et psychologique. 
            Trades: ${JSON.stringify(trades)}
            ${
              journal
                ? `
            État d'esprit du trader: ${journal.mood}
            Journal: ${journal.content}
            `
                : ''
            }
            
            Dis-moi vite:
            1. Comment j'ai géré mes trades techniquement
            2. Si mon état d'esprit a influencé mes décisions
            3. Ce que je peux améliorer
            
            Sois concis et direct. Max 200 mots.
            Finis par une phrase de motivation ou un conseil pratique, genre "Recommandation: ..."`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing trades:', error);
    throw error;
  }
};
