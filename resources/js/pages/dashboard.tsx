import { Head } from '@inertiajs/react';
import { useState } from 'react';
import FileUpload from '@/components/file-upload';
import SubmissionsTable from '@/components/submissions-table';
import LatestSubmissionCard from '@/components/latest-submission-card';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

type Submission = {
    id: number;
    title: string;
    name: string;
    email: string;
    version: string;
    status: string;
    recommendations: string | null;
    user_id: number;
    user_name: string | null;
    submitted_at: string | null;
    download_url: string;
    replace_url: string;
    delete_url: string;
    files: { id: number; file_name: string; file_size: number; file_extension: string; download_url: string }[];
    histories: { id: number; file_name: string; status: string; comment: string | null; submitted_at: string | null; download_url: string }[];
    history_count: number;
};

type Props = {
    submissions: Submission[];
    user: {
        id: number;
        name: string;
        email: string;
        is_admin: boolean;
        submission_count: number;
    };
    users_count: number;
};

export default function Dashboard({ submissions, user }: Props) {
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredSubmissions =
        statusFilter === 'all'
            ? submissions
            : submissions.filter((s) => s.status === statusFilter);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {!user.is_admin && (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 md:col-span-2 dark:border-sidebar-border">
                            <FileUpload title="Create a Submission" hasSubmissions={submissions.length > 0} />
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <LatestSubmissionCard submission={submissions[0] ?? null} />
                        </div>
                    </div>
                )}
                {user.is_admin ? (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Filter by status:</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="under review" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Under Review</SelectItem>
                                <SelectItem value="needs revision" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Needs Revision</SelectItem>
                                <SelectItem value="recommended for journal submission" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Recommended for Journal Submission</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                ) : null}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <SubmissionsTable submissions={filteredSubmissions} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
