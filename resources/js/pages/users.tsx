import { Head } from '@inertiajs/react';
import { Users } from 'lucide-react';

type User = {
    id: number;
    name: string;
    email: string;
    submission_count: number;
    created_at: string | null;
};

type Props = {
    users: User[];
};

export default function UsersPage({ users }: Props) {
    return (
        <>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="flex h-full flex-col p-4">
                        <div className="mb-4 flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-medium">Registered Users</h3>
                            <span className="ml-auto text-sm text-muted-foreground">
                                {users.length} {users.length === 1 ? 'user' : 'users'}
                            </span>
                        </div>

                        {users.length === 0 ? (
                            <div className="flex flex-1 items-center justify-center">
                                <p className="text-sm text-muted-foreground">
                                    No other registered users.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-sidebar-border/70">
                                            <th className="pb-2 pr-3 font-medium text-muted-foreground">ID</th>
                                            <th className="pb-2 pr-3 font-medium text-muted-foreground">Name</th>
                                            <th className="pb-2 pr-3 font-medium text-muted-foreground">Email</th>
                                            <th className="pb-2 pr-3 font-medium text-muted-foreground">Submissions</th>
                                            <th className="pb-2 font-medium text-muted-foreground">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-sidebar-border/40 last:border-0"
                                            >
                                                <td className="py-2 pr-3 font-mono text-muted-foreground">
                                                    {user.id}
                                                </td>
                                                <td className="py-2 pr-3 font-medium">
                                                    {user.name}
                                                </td>
                                                <td className="py-2 pr-3 text-muted-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="py-2 pr-3 font-mono text-muted-foreground">
                                                    {user.submission_count}
                                                </td>
                                                <td className="py-2 text-muted-foreground">
                                                    {user.created_at ?? '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

UsersPage.layout = {
    breadcrumbs: [
        {
            title: '水老师审稿',
            href: '/dashboard',
        },
        {
            title: 'Users',
            href: '/users',
        },
    ],
};
