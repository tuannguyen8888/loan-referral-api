import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("mc_case", {schema: "loan_referral"})
export class McCase {
    @PrimaryGeneratedColumn({type: "int", name: "id"})
    id: number;

    @Column("int", {
        name: "appNumber",
        nullable: true,
        default: 0,
        comment: "Mã hồ sơ vừa khởi tạo của Mobile For Sale"
    })
    appNumber: number;

    @Column("int", {
        name: "creditAppId",
        nullable: true,
        default: 0,
        comment: ""
    })
    creditAppId: number;

    @Column("varchar", {
        name: "createdDate",
        length: 255,
        nullable: true,
        default: "",
        comment: "Ngày khởi tạo hồ sơ"
    })
    createdDate: string;

    @Column("varchar", {
        name: "customerName",
        length: 255,
        nullable: true,
        default: "",
        comment: "Tên khách hàng"
    })
    customerName: string;

    @Column("varchar", {
        name: "citizenId",
        length: 255,
        nullable: true,
        default: "",
        comment: "CMND/CMQD"
    })
    citizenId: string;

    @Column("varchar", {
        name: "productName",
        length: 255,
        nullable: true,
        default: "",
        comment: "Tên sản phẩm"
    })
    productName: string;

    @Column("double", {
        name: "loanAmount",
        nullable: true,
        default: "",
        comment: "Số tiền cho vay"
    })
    loanAmount: number;

    @Column("int", {
        name: "loanTenor",
        nullable: true,
        default: "",
        comment: "Kỳ hạn vay"
    })
    loanTenor: number;

    @Column("int", {
        name: "hasInsurance",
        nullable: true,
        default: "",
        comment: "Khách hàng có đăng ký bảo hiểm hay không"
    })
    hasInsurance: number;

    @Column("int", {
        name: "tempResidence",
        nullable: true,
        default: "",
        comment: "Địa chỉ sống trùng hộ khẩu"
    })
    tempResidence: number;

    @Column("varchar", {
        name: "kioskAddress",
        length:255,
        nullable: true,
        default: "",
        comment: "Địa chỉ sống trùng hộ khẩu"
    })
    kioskAddress: string;

    @Column("varchar", {
        name: "bpmStatus",
        length:20,
        nullable: true,
        default: "",
        comment: "Trạng thái trả về của BPm"
    })
    bpmStatus: string;

    @Column("int", {
        name: "reasonsid",
        nullable: true,
        default: "",
        comment: ""
    })
    reasonsid: number;

    @Column("varchar", {
        name: "reason",
        length:255,
        nullable: true,
        default: "",
        comment: "Lý do trả về"
    })
    reason: string;

    @Column("varchar", {
        name: "reasonDetail",
        length:255,
        nullable: true,
        default: "",
        comment: "Lý do trả về chi tiết"
    })
    reasonDetail: string;

    @Column("varchar", {
        name: "userComment",
        length:255,
        nullable: true,
        default: "",
        comment: "BPM comment kết quả trả về"
    })
    userComment: string;

    @Column("int", {
        name: "pdfFilesid",
        nullable: true,
        default: "",
        comment: "Mã file PDF"
    })
    pdfFilesid: number;

    @Column("varchar", {
        name: "pdfCreatedDate",
        length:255,
        nullable: true,
        default: "",
        comment: "Ngày khởi tạo file PDF"
    })
    pdfCreatedDate: string;

    @Column("varchar", {
        name: "remotePathServer",
        length:255,
        nullable: true,
        default: "",
        comment: "Đường dẫn server chứa file PDF"
    })
    remotePathServer: string;

    @Column("varchar", {
        name: "fileName",
        length:255,
        nullable: true,
        default: "",
        comment: "tên file PDF"
    })
    fileName: string;

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
