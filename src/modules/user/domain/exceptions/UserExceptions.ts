export class UserNotFoundException extends Error {
    constructor(identifier: string) {
        super(`User not found: ${identifier}`);
        this.name = 'UserNotFoundException';
    }
}

export class UserAlreadyExistsException extends Error {
    constructor(email: string) {
        super(`User with email ${email} already exists`);
        this.name = 'UserAlreadyExistsException';
    }
}

export class InvalidCredentialsException extends Error {
    constructor() {
        super('Invalid email or password');
        this.name = 'InvalidCredentialsException';
    }
}

export class UnauthorizedException extends Error {
    constructor(message: string = 'Unauthorized access') {
        super(message);
        this.name = 'UnauthorizedException';
    }
}