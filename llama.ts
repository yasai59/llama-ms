import { getStocks } from "./server/helpers/getStocks";

class Llama {
  private model: string;
  private url: string;


  constructor() {
    this.model = Bun.env.OLLAMA_MODEL as string;
    this.url = Bun.env.OLLAMA_URL as string;
  }

  async chat(messages: { role: string; content: string }[]): Promise<String> {
    const response = await fetch(`${this.url}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false
      })
    });

    if (!response.ok) {
      console.error("Error llamando a Ollama:", response.statusText);
      return '1';
    }

    let data = {message: {content: ""}};

    try {
      data = await response.json() as {message: {content: string}};
    } catch (error) {
      console.error("Ollama response invalid:", error);
      return '1';
    }
    return data.message.content;
  }

  async getRiskScore(userJson: string): Promise<number> {
    const sysmessage = `At the end of this message, you will be given a JSON object, containing financial user data, like transactions, income, balances, investements, etc. 
    Your task is to analyze that data and when the user asks: 'what is my risk score?' you have to answer only with a number between 1 and 5,
    where 1 means the user is very low risk-tolerant and 5 means the user is very high risk-tolerant. You have to be very careful with the data you are analyzing, 
    because if you give a wrong risk score, it could cause a lot of problems to the user. ${userJson}  
    IT'S VERY IMPORTANT THAT YOU GIVE ONLY A NUMBER, NOTHING LESS NOTHING MORE, IF YOU DON'T KNOW WHAT TO ANSWER, JUST SAY 1`;

    const response = await this.chat([
      { role: "system", content: sysmessage },
      { role: "user", content: "What is my risk score?" }
    ]);
    const riskScore = Number(response);
    if (isNaN(riskScore) || riskScore < 1 || riskScore > 5) {
      console.error("Invalid risk score:", response);
      return 1;
    }
    return riskScore;
  }

  async getFinancialMark(userJson: string): Promise<number> {
    const sysmessage = `At the end of this message, you will be given a JSON object, containing financial user data, like transactions, income, balances, investements, etc. 
    Your task is to analyze that data and when the user asks: 'what is my financial mark?' you have to answer only with a number between 1 and 100,
    where 1 means hi has very poor finances and could do really better, and 100 means he's doing the best he can and there's nothing to improve. You have to be very careful 
    with the data you are analyzing, because if you give a wrong financial mark, it could cause a lot of problems to the user. ${userJson}
    IT'S VERY IMPORTANT THAT YOU GIVE ONLY A NUMBER, NOTHING LESS NOTHING MORE, IF YOU ARE GOING TO SAY ANYTHING ELSE, JUST SAY 1`;

    const response = await this.chat([
      { role: "system", content: sysmessage },
      { role: "user", content: "What is my financial mark?" }
    ]);

    const financialMark = Number(response);
    if (isNaN(financialMark) || financialMark < 1 || financialMark > 100) {
      console.error("Invalid financial mark:", response);
      return 1;
    }

    return financialMark;
  }

  async getInvestmentAdvice(userJson: string): Promise<string> {
    // TODO: revisar esto
    const sysmessage = `At the end of this message, you will be given a JSON object, containing financial user data, like transactions, income, balances, investements, etc. 
    Your task is to analyze that data and when the user asks: 'what is my investment advice?' you have to answer only with a JSON object with the following structure:
    {
      "product": "string",
      "desc": "string",
    }
    where product is a financial product and desc is why do you think the user should invest in that product. You have to be very careful with the data you are analyzing, 
    because if you give a wrong investment advice, it could cause a lot of problems to the user.
    The stocks you can suggest are: 
    ${await getStocks()}
    User data:
    ${userJson}
    IT'S VERY IMPORTANT THAT YOU GIVE ONLY A JSON OBJECT, NOTHING LESS NOTHING MORE, IF YOU DON'T KNOW WHAT TO ANSWER, JUST SAY: {"product": "none", "desc": "none"}`;

    const response = await this.chat([
      { role: "system", content: sysmessage },
      { role: "user", content: "What is my investment advice?" }
    ]);
    return String(response);
  }

  async getAssetRecommendation(userJson: string, news: string): Promise<number> {

    const sysmessage = `At the end of this message, you will be given a JSON object, containing financial user data and a string with news of the asset he's consulting about,
    your task is to analyze that data and see what is the best action for the user: 1. Buy, 2. Sell, 3. Hold, 4. Don't buy, 5. Asset not recommended for the user. When the user asks: what should I do whith this asset? 
    you have to answer only with the number of the action you choose. Nothing else, nothing more. You have to be very careful with the data you are analyzing,
    because if you give a wrong recommendation, it could cause a lot of problems to the user. ${userJson} ${news}
    IT'S VERY IMPORTANT THAT YOU GIVE ONLY A NUMBER, NOTHING LESS NOTHING MORE, IF YOU DON'T KNOW WHAT TO ANSWER, JUST SAY 1. Remember, if the user doesn't have the asset, can't hold it or sell it`;

    const response = await this.chat([
      { role: "system", content: sysmessage },
      { role: "user", content: "What should I do with this asset?" }
    ]);
    const recommendation = Number(response);
    if (isNaN(recommendation) || recommendation < 1 || recommendation > 5) {
      console.error("Invalid recommendation:", response);
      return 1;
    }
    return recommendation;
  }
  
  async getRecommendations(userJson: string): Promise<string> {
    const sysmessage = `At the end of this message, you will be given a JSON object, containing financial user data, like transactions, income, balances, investements, etc. 
    Your task is to analyze that data and when the user asks: 'what are my recommendations?' you have to answer only with a JSON object with the following structure:
      [
        {
          "action": "string",
          "reason": "string"
        }
      ]
    Where recommendations is an array of objects where action is an action the user should do improve it's financial situation, it could be anything,
    from spending less, investing more, to save more money, anything (not anything very specific like a certain stock), but if the user is not doing that bad, 
    you know, it could be better but definitively not bad, don't say anything, if you have nothing to say, just return recommendations as an empty array. 
    You have to be very careful with the data you are analyzing, because if you give a wrong recommendation, it could cause a lot of problems to the user. ${userJson}
    IT'S VERY IMPORTANT THAT YOU GIVE ONLY A JSON OBJECT, NOTHING LESS NOTHING MORE, IF YOU DON'T KNOW WHAT TO ANSWER, JUST SAY: []
    `;

    const response = await this.chat([
      { role: "system", content: sysmessage },
      { role: "user", content: "What are my recommendations?" }
    ]);
    return String(response);
  }
}

export default Llama;