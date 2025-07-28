
import { addDoc, collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../../../service/firebaseConfig';
import { IBooking, IBookingRequest, IYogaClass, IYogaCourse } from '../interface/yogaInterface';

export class YogaService {
    private courseCollectionName = 'yoga_classes';
    private bookingsCollectionName = 'bookings';  

    async getYogaCourse(): Promise<IYogaCourse[]> {
        try {
            const courseCollection = collection(db, this.courseCollectionName);
            const snapShot = await getDocs(courseCollection);
            return snapShot.docs.map((doc) => ({
                id: doc.id, 
                ...doc.data()
            })) as IYogaCourse[];
        } catch (error) {
            console.error("Error fetching yoga course", error);
            throw error;
        }
    }

    async getClassesForCourse(courseId: string): Promise<IYogaClass[]> {
        try {
            const classesRef = collection(db, this.courseCollectionName, courseId, 'classes');
            const snapshot = await getDocs(classesRef);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                date: doc.id,
                courseId: courseId,
                ...doc.data()
            })) as IYogaClass[];
        } catch (error) {
            console.error("Error fetching classes for course", error);
            throw error;
        }
    }

    // Search classes across all courses based on day and time filters
    async searchClassesByDayAndTime(filters: {
        day?: string;
        timeCategory?: 'All Times' | 'Morning' | 'Afternoon' | 'Evening';
    } = {}): Promise<IYogaClass[]> {
        try {
            // Get all courses first
            const courseCollection = collection(db, this.courseCollectionName);
            const coursesSnapshot = await getDocs(courseCollection);
            const allCourses = coursesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as IYogaCourse[];

            const matchingClasses: IYogaClass[] = [];

            // For each course, get its classes and check if they match filters
            for (const course of allCourses) {
                try {
                    // Check if course matches day filter
                    if (filters.day && filters.day !== 'All Days') {
                        if (course.day !== filters.day) {
                            continue;
                        }
                    }

                    // Check if course matches time filter
                    if (filters.timeCategory && filters.timeCategory !== 'All Times') {
                        const hour = parseInt(course.time.split(':')[0]);
                        let timeMatches = false;
                        switch (filters.timeCategory) {
                            case 'Morning':
                                timeMatches = hour >= 6 && hour < 12;
                                break; 
                            case 'Afternoon':
                                timeMatches = hour >= 12 && hour < 17;
                                break;
                            case 'Evening':
                                timeMatches = hour >= 17 && hour <= 24;
                                break;
                        }
                        if (!timeMatches) {
                            continue;
                        }
                    }

                    // If course matches filters, get all its classes
                    const classesRef = collection(db, this.courseCollectionName, course.id, 'classes');
                    const classesSnapshot = await getDocs(classesRef);
                    const classes = classesSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        date: doc.id,
                        courseId: course.id,
                        courseType: course.type,
                        courseDay: course.day,
                        courseTime: course.time,
                        courseDuration: course.duration,
                        coursePrice: course.price,
                        courseIntensity: course.intensity,
                        ...doc.data()
                    })) as IYogaClass[];
                    matchingClasses.push(...classes);
                } catch (classError) {
                    console.warn(`Error fetching classes for course ${course.id}:`, classError);
                    continue;
                }
            }
            return matchingClasses;
        } catch (error) {
            console.error("Error searching classes by day and time", error);
            throw error;
        }
    }

    // Booking class 
    async createBooking(bookingRequest: IBookingRequest): Promise<IBooking> {
        try {
            const bookingData = {
                email: bookingRequest.email,
                items: bookingRequest.items,
                totalPrice: bookingRequest.totalPrice,
                bookingDate: bookingRequest.bookingDate,
                status: 'confirmed' as const,
                createdAt: Timestamp.now(),
            };

            const bookingsCollection = collection(db, this.bookingsCollectionName);
            const docRef = await addDoc(bookingsCollection, bookingData);
            
            return {
                id: docRef.id,
                email: bookingData.email,
                items: bookingData.items,
                totalPrice: bookingData.totalPrice,
                bookingDate: bookingData.bookingDate,
                status: bookingData.status,
                createdAt: new Date().toISOString(), // Use current timestamp as string
            } as IBooking;
        } catch (error) {
            console.error("Error creating booking", error);
            throw error;
        }
    }

    async getBookingsForUser(email: string): Promise<IBooking[]> {
        try {
            const bookingsCollection = collection(db, this.bookingsCollectionName);
            const q = query(bookingsCollection, where('email', '==', email));
            const snapshot = await getDocs(q);
            
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    bookingDate: data.bookingDate instanceof Timestamp ? data.bookingDate.toDate().toISOString() : data.bookingDate,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
                };
            }) as IBooking[];
        } catch (error) {
            console.error("Error fetching user bookings", error);
            throw error;
        }
    }

    async getAllBookings(): Promise<IBooking[]> {
        try {
            const bookingsCollection = collection(db, this.bookingsCollectionName);
            const snapshot = await getDocs(bookingsCollection);
            return snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    bookingDate: data.bookingDate instanceof Timestamp ? data.bookingDate.toDate().toISOString() : data.bookingDate,
                    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
                };
            }) as IBooking[];
        } catch (error) {
            console.error("Error fetching all bookings", error);
            throw error;
        }
    }
}   
export const yogaService = new YogaService();


 