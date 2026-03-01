import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("paymentcustomers")
export class PaymentCustomer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nolayanan: string;

  @Column()
  invoice: string;

  @Column()
  tanggalbayar: string;

  @Column()
  waktubayar: string;

  @Column()
  gambar: string;

  @CreateDateColumn({
    type: "datetime",
  })
  create_at!: Date;

  @CreateDateColumn({
    type: "datetime",
  })
  updated_at!: Date;
}
