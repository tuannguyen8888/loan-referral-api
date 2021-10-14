import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("mc_cicresult", {schema: "loan_referral"})
export class McCicResult {
    @PrimaryGeneratedColumn({type: "int", name: "id"})
    id: number;

    @Column("int", {
        name: "appNumber",
        nullable: true,
        default: 0,
        comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
    })
    appNumber: number;

    @Column("varchar", {
        name: "requestId",
        length: 20,
        nullable: true,
        default: "",
        comment: "id cho request đã được tạo trước đó"
    })
    requestId: string;

    @Column("varchar", {
        name: "identifier",
        length: 255,
        nullable: true,
        default: "",
        comment: "Chứng minh nhân dân"
    })
    identifier: string;

    @Column("varchar", {
        name: "customerName",
        length: 255,
        nullable: true,
        default: "",
        comment: "Tên khách hàng"
    })
    customerName: string;

    @Column("int", {
        name: "cicResult",
        nullable: true,
        default: 0,
        comment: "mã cic"
    })
    cicResult: number;

    @Column("varchar", {
        name: "cicDescription",
        length: 255,
        nullable: true,
        default: "",
        comment: "Mô tả cic"
    })
    cicDescription:string;

    @Column("varchar", {
        name: "cicImageLink",
        length: 255,
        nullable: true,
        default: "",
        comment: "Tên ảnh chụp kết quả"
    })
    cicImageLink:string;

    @Column("timestamp", {
        name: "lastUpdateTime",
        default: () => "CURRENT_TIMESTAMP",
        comment: "Tên ảnh chụp kết quả"
    })
    lastUpdateTime: Date;

    @Column("varchar", {
        name: "status",
        length: 20,
        nullable: true,
        default: "",
        comment: "Trạng thái: SUCCESS"
    })
    status:string;

    @Column("timestamp", {
        name: "created_at",
        default: () => "CURRENT_TIMESTAMP"
    })
    createdAt: Date;

    @Column("varchar", {
        name: "created_by",
        length: 255,
        default: ""
    })
    createdBy: string | null;

    @Column("timestamp", {name: "updated_at", nullable: true})
    updatedAt: Date | null;

    @Column("varchar", {name: "updated_by", nullable: true, length: 255})
    updatedBy: string | null;

    @Column("timestamp", {name: "deleted_at", nullable: true})
    deletedAt: Date | null;

    @Column("varchar", {name: "deleted_by", nullable: true, length: 255})
    deletedBy: string | null;
}
