import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BasedataService {
  constructor() {}

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
        purple: {
          name: 'Purple',
          hex: '#826CB0',
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
            name: 'Recurring Bills',
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
          iconName: ''
        },
        bills: {
          name: 'Bills',
          iconName: ''
        },
        groceries: {
          name: 'Groceries',
          iconName: ''
        },
        diningOut: {
          name: 'Dining Out',
          iconName: ''
        },
        transportation: {
          name: 'Transportation',
          iconName: ''
        },
        personalCare: {
          name: 'Personal Care',
          iconName: ''
        },
        education: {
          name: 'Education',
          iconName: ''
        },
        lifestyle: {
          name: 'Lifestyle',
          iconName: ''
        },
        shopping: {
          name: 'Shopping',
          iconName: ''
        },
        general: {
          name: 'General',
          iconName: ''
        }
      },
    },
  };
}
