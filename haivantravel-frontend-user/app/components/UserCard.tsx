import Image from "next/image";

export default function UserCard() {
    return (
        <div className="flex flex-row">
            <Image src="/images/user-avatar.png" alt="user avatar" width={50} height={50}/>
            <div className="flex flex-col">
                <p className="text-[13px] font-bold">Trần Duy Khánh</p>
                <p className="text-[12px] text-[#3F9293]">Admin Page</p>
            </div>
        </div>
    )
}