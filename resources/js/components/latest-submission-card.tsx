import { Clock } from 'lucide-react';
import { truncateTitle } from '@/lib/utils';

type Submission = {
    id: number;
    title: string;
    name: string;
    email: string;
    version: string;
    status: string;
    recommendations: string | null;
    submitted_at: string | null;
    download_url: string;
    files: { id: number; file_name: string; file_size: number; file_extension: string }[];
};

type Props = {
    submission: Submission | null;
};

function statusVariant(status: string) {
    switch (status) {
        case 'recommended for journal submission':
        case 'approved':
        case 'accepted':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'rejected':
        case 'needs revision':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        case 'under review':
        default:
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
}

export default function LatestSubmissionCard({ submission }: Props) {
    return (
        <div className="flex flex-col justify-start p-4">
            <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Latest Submission</h3>
            </div>

            {!submission ? (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No submissions yet.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Title</span>
                        <span className="max-w-[140px] truncate font-medium">{truncateTitle(submission.title)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-mono">v{submission.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusVariant(
                                submission.status,
                            )}`}
                        >
                            {submission.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Submitted</span>
                        <span className="text-muted-foreground">
                            {submission.submitted_at ?? '—'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
