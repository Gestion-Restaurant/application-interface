interface IUser {
    _id: string;
    name: string;
    email: string;
    address?: string;
    description?: string;
    openingTime?: string;
    closingTime?: string;
}

export default IUser;