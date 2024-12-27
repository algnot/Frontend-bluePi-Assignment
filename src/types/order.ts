export interface CreateOrderLineRequest {
  product_id: string;
  quantity: number;
}

export interface CreateOrderRequest {
  order_line: CreateOrderLineRequest[];
}

export interface OrderLine {
  product_id: string;
  image_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  sale_order_name: string;
  status: string;
  total: number;
  order_line: OrderLine[];
  created_at: string;
  updated_at: string;
}

export interface Coin {
  [x: string]: any;
  name: string;
  key: string;
  value: number;
  quantity: number;
}

export interface UserCoin {
  coin_1: number;
  coin_5: number;
  coin_10: number;
  bank_20: number;
  bank_50: number;
  bank_100: number;
  bank_500: number;
  bank_1000: number;
}

export interface PayOrderRequest {
  sale_order_name: string;
  user_coin: UserCoin;
}

export interface PayOrderResponse {
    is_error: boolean;
    message: string;
    change_coin: UserCoin;
}

export const convertToUserCoin = (coinData: Coin[]): UserCoin => {
    const userCoin: UserCoin = {
      coin_1: 0,
      coin_5: 0,
      coin_10: 0,
      bank_20: 0,
      bank_50: 0,
      bank_100: 0,
      bank_500: 0,
      bank_1000: 0,
    };

    coinData.forEach((coin) => {
      userCoin[coin.key as keyof UserCoin] = coin.quantity;
    });

    return userCoin;
};

export const formatChangeMessage = (response: PayOrderResponse | undefined): string => {
    if (!response || !response.change_coin) {
        return "No change.";
    }

    const changeCoin = response.change_coin;
    const changeMessages: string[] = [];

    for (const [coinType, quantity] of Object.entries(changeCoin)) {
        if (quantity > 0) {
            let coinValue: number;
            let coinUnit = "THB";

            switch (coinType) {
                case "coin_1": coinValue = 1; break;
                case "coin_5": coinValue = 5; break;
                case "coin_10": coinValue = 10; break;
                case "bank_20": coinValue = 20; break;
                case "bank_50": coinValue = 50; break;
                case "bank_100": coinValue = 100; break;
                case "bank_500": coinValue = 500; break;
                case "bank_1000": coinValue = 1000; break;
                default:
                    console.warn(`Unknown coin type: ${coinType}`); 
                    continue;
            }

            changeMessages.push(`• ${coinValue} ${coinUnit} ${quantity} ${quantity > 1 ? "Units" : "Unit"}`);
        }
    }

    if (changeMessages.length === 0) {
        return "No change.";
    }

    return `You will get change:<br/>${changeMessages.join("<br/>")}`; 
};
