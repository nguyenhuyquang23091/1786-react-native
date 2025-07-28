

export interface IYogaCourse {
    id:string,
    capacity : number,
    day : string, 
    description : string, 
    duration : number, 
    intensity : string, 
    price : number, 
    time : string, 
    type : string
}

export interface IYogaClass {
    id: string;
    date: string;
    teacher : string;
    courseType?: string;
    title  : string,
    description: string;
    courseId?: string;
    // Optional course details for filtered classes
  
    courseDay?: string;
    courseTime?: string;
    courseDuration?: number;
    coursePrice?: number;
    courseIntensity?: string;
}

export interface IBookingRequest {
    email: string;
    items: ICartItem[];
    totalPrice: number;
    bookingDate: string;
}

export interface ICartItem {
    id: string;
    classData: IYogaClass;
    quantity: number;
    addedAt: string;
}

export interface IBooking {
    id: string;
    email: string;
    items: ICartItem[];
    totalPrice: number;
    bookingDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string ;
}