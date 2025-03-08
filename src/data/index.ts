export interface Category {
  id: number;
  name: string;
  children: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  properties: Property[];
}

export interface Property {
  id: number;
  name: string;
  options: Option[];
  hasChild?: boolean;
  childPropertyId?: number; // Links to another property if it has children
}

export interface Option {
  id: number;
  name: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Cars",
    children: [
      {
        id: 11,
        name: "Toyota",
        properties: [
          {
            id: 101,
            name: "Model",
            options: [
              { id: 1, name: "Camry" },
              { id: 2, name: "Corolla" },
              { id: 3, name: "Other" },
            ],
            hasChild: true,
            childPropertyId: 102,
          },
          {
            id: 102,
            name: "Type",
            options: [
              { id: 4, name: "Sedan" },
              { id: 5, name: "SUV" },
              { id: 6, name: "Other" },
            ],
          },
        ],
      },
      {
        id: 12,
        name: "Honda",
        properties: [
          {
            id: 103,
            name: "Model",
            options: [
              { id: 7, name: "Civic" },
              { id: 8, name: "Accord" },
              { id: 9, name: "Other" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Electronics",
    children: [
      {
        id: 21,
        name: "Phones",
        properties: [
          {
            id: 104,
            name: "Brand",
            options: [
              { id: 10, name: "Apple" },
              { id: 11, name: "Samsung" },
              { id: 12, name: "Other" },
            ],
          },
        ],
      },
    ],
  },
];
