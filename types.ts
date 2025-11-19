export interface BusinessInfo {
  name: string;
  banner: {
    imageUrl: string;
    title: string;
    subtitle: string;
  };
  hours: string[];
  contact: {
    phone: string;
    address: string;
    social: {
      instagram: string;
      facebook: string;
    };
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  hasImage: boolean;
  categoryId: string;
}
