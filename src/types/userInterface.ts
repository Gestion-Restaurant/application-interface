interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    address?: string;
    description?: string;
    openingTime?: string;
    closingTime?: string;
}

export default IUser;