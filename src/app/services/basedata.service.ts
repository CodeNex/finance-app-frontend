import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BasedataService {
  constructor() {}

  /**
   * Returns guest login credentials from the current app config.
   * Used for quick guest access without a user account.
   */
  public get guestLoginData() {
    return this.financeApp.basics.apiData.guestLogin;
  }

  public financeApp: any = {
    basics: {
      apiData: {
        baseUrl: 'https://finance.code-nex.de/api',
        // baseUrl: 'http://localhost:3000/dummyData',
        localStorage: {
          tokenKey: 'sdio732d_uuw12!#SDo072354°ka',
        },
        guestLogin: {
          email: '  guest@guest.com',
          password: 'password',
        },
      },
      colors: {
        green: {
          name: 'Green',
          hex: '#277C78',
        },
        yellow: {
          name: 'Yellow',
          hex: '#F2CDAC',
        },
        cyan: {
          name: 'Cyan',
          hex: '#82C9D7',
        },
        navy: {
          name: 'Navy',
          hex: '#626070',
        },
        red: {
          name: 'Red',
          hex: '#C94736',
        },
        lightRed: {
          name: 'Lightred',
          hex: '#d46c5e',
        },
        purple: {
          name: 'Purple',
          hex: '#826CB0',
        },
        pink: {
          name: 'Pink',
          hex: '#af81ba',
        },
        turquoise: {
          name: 'Turquoise',
          hex: '#597C7C',
        },
        brown: {
          name: 'Brown',
          hex: '#93674F',
        },
        magenta: {
          name: 'Magenta',
          hex: '#934F6F',
        },
        blue: {
          name: 'Blue',
          hex: '#3F82B2',
        },
        grey: {
          name: 'Grey',
          hex: '#97a0ac',
        },
        Forest: {
          name: 'Forest',
          hex: '#7f9161',
        },
        Gold: {
          name: 'Gold',
          hex: '#cab361',
        },
        Orange: {
          name: 'Orange',
          hex: '#be6c49',
        },
      },
    },
    login: '',
    navbar: {
      links: {
        main: [
          {
            name: 'Overview',
            path: 'overview',
            img: '/img/navbar/overview-img.svg',
          },
          {
            name: 'Transactions',
            path: 'transactions',
            img: '/img/navbar/transactions-img.svg',
          },
          {
            name: 'Budgets',
            path: 'budgets',
            img: '/img/navbar/budgets-img.svg',
          },
          {
            name: 'Pots',
            path: 'pots',
            img: '/img/navbar/pots-img.svg',
          },
          {
            name: 'Recurrings',
            path: 'recurringBills',
            img: '/img/navbar/bills-img.svg',
          },
        ],
        sub: [
          {
            name: 'Settings',
            path: 'settings',
            img: '/img/navbar/settings-img.svg',
          },
          {
            name: 'Imprint',
            path: 'imprint',
            img: '/img/navbar/imprint-img.svg',
          },
        ],
      },
    },
    budgets: {
      categories: {
        entertainment: {
          name: 'Entertainment',
          iconName: 'entertainment',
        },
        bills: {
          name: 'Bills',
          iconName: 'bills',
        },
        groceries: {
          name: 'Groceries',
          iconName: 'groceries',
        },
        diningOut: {
          name: 'Dining Out',
          iconName: 'diningOut',
        },
        transportation: {
          name: 'Transportation',
          iconName: 'transportation',
        },
        personalCare: {
          name: 'Personal Care',
          iconName: 'personalCare',
        },
        education: {
          name: 'Education',
          iconName: 'education',
        },
        lifestyle: {
          name: 'Lifestyle',
          iconName: 'lifestyle',
        },
        shopping: {
          name: 'Shopping',
          iconName: 'shopping',
        },
        general: {
          name: 'General',
          iconName: 'general',
        },
      },
    },
    recurrings: {
      types: {
        singleTransaction: {
          name: 'Single Transaction',
          value: null,
        },
        weekly: {
          name: 'Every Week',
          value: 'weekly',
        },
        twoWeeks: {
          name: 'Every Two Weeks',
          value: 'twoWeeks',
        },
        monthly: {
          name: 'Every Month',
          value: 'monthly',
        },
        quarterly: {
          name: 'Every Three Months',
          value: 'quarterly',
        },
        halfYearly: {
          name: 'Every Six Months',
          value: 'halfYearly',
        },
        yearly: {
          name: 'Every Year',
          value: 'yearly',
        },
      },
    },
  };
}
