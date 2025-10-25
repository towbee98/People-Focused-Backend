import {Column, Entity, ObjectId, ObjectIdColumn} from 'typeorm';


export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPERADMIN',
    EMPLOYER = 'EMPLOYER'
}

@Entity('users')
export class User {

    @ObjectIdColumn({primary: true})
    id: ObjectId;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;
    // Other user properties can be added here

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role:UserRole 

    @Column({ nullable: true })
    fullName?: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    location?: string;

    @Column({ nullable: true })
    otp?: string;

    @Column({ nullable: true })
    otpExpires?: Date;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    @Column({ nullable: true })
    refreshToken?: string;
}   