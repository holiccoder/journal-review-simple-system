type Props = {
    user: {
        id: number;
        name: string;
        email: string;
        submission_count: number;
    };
};

export default function UserInfoCard({ user }: Props) {
    return (
        <div className="flex h-full flex-col justify-start p-4">
        </div>
    );
}
