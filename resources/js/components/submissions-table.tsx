import { FileText, Trash2 } from 'lucide-react';
import { truncateTitle } from '@/lib/utils';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import DeleteConfirmModal from '@/components/delete-confirm-modal';
import SubmissionDetailModal from '@/components/submission-detail-modal';
import SubmissionHistoryModal from '@/components/submission-history-modal';
import { Button } from '@/components/ui/button';

type FileEntry = {
    id: number;
    file_name: string;
    file_size: number;
    file_extension: string;
    download_url: string;
};

type HistoryEntry = {
    id: number;
    file_name: string;
    status: string;
    comment: string | null;
    submitted_at: string | null;
    download_url: string;
};

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
    files: FileEntry[];
    histories: HistoryEntry[];
    history_count: number;
};

type Props = {
    submissions: Submission[];
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

export default function SubmissionsTable({ submissions }: Props) {
    const [detailTarget, setDetailTarget] = useState<Submission | null>(null);
    const [historyTarget, setHistoryTarget] = useState<Submission | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null);

    const { auth } = usePage().props;
    const authUser = auth?.user as Record<string, unknown>;
    const currentUserId = authUser?.id as number;
    const isAdmin = (authUser?.is_admin ?? false) as boolean;

    return (
        <div className="flex h-full flex-col p-4">
            <div className="mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Submissions</h3>
                <span className="ml-auto text-sm text-muted-foreground">
                    {submissions.length} {submissions.length === 1 ? 'record' : 'records'}
                </span>
            </div>

            {submissions.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No submissions yet. Upload a file above.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-sidebar-border/70">
                                <th className="w-full pb-2 pr-3 font-medium text-muted-foreground">Title</th>
                                <th className="whitespace-nowrap pb-2 pr-3 font-medium text-muted-foreground">Version</th>
                                <th className="whitespace-nowrap pb-2 pr-3 font-medium text-muted-foreground">Status</th>
                                <th className="whitespace-nowrap pb-2 pr-3 font-medium text-muted-foreground">Updated</th>
                                <th className="pb-2 font-medium text-muted-foreground"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((submission) => (
                                <tr
                                    key={submission.id}
                                    className="cursor-pointer border-b border-sidebar-border/40 transition-colors hover:bg-muted/50 last:border-0"
                                    onClick={() => setDetailTarget(submission)}
                                >
                                    <td className="py-2 pr-3">
                                        <span className="truncate block">
                                            {truncateTitle(submission.title)}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 text-muted-foreground">
                                        v{submission.version}
                                    </td>
                                    <td className="whitespace-nowrap py-2 pr-3">
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusVariant(
                                                submission.status,
                                            )}`}
                                        >
                                            {submission.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap py-2 pr-3 text-muted-foreground">
                                        {submission.submitted_at ?? '—'}
                                    </td>
                                    <td className="py-2 text-right">
                                        {(submission.user_id === currentUserId || isAdmin) && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteTarget(submission);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {detailTarget && (
                <SubmissionDetailModal
                    open={true}
                    onClose={() => setDetailTarget(null)}
                    submission={detailTarget}
                    onUploaded={() => setDetailTarget(null)}
                />
            )}

            {historyTarget && (
                <SubmissionHistoryModal
                    open={true}
                    onClose={() => setHistoryTarget(null)}
                    submission={historyTarget}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    open={true}
                    onClose={() => setDeleteTarget(null)}
                    submission={deleteTarget}
                />
            )}
        </div>
    );
}
