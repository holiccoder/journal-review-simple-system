import { FileText, History } from 'lucide-react';
import { useState } from 'react';
import ReplaceFileModal from '@/components/replace-file-modal';
import SubmissionDetailModal from '@/components/submission-detail-modal';
import SubmissionHistoryModal from '@/components/submission-history-modal';
import { Button } from '@/components/ui/button';

type FileEntry = {
    id: number;
    file_name: string;
    file_size: number;
    file_extension: string;
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
    comment: string | null;
    user_name: string | null;
    submitted_at: string | null;
    download_url: string;
    replace_url: string;
    files: FileEntry[];
    histories: HistoryEntry[];
    history_count: number;
};

type Props = {
    submissions: Submission[];
};

function statusVariant(status: string) {
    switch (status) {
        case 'recommend submission':
        case 'approved':
        case 'accepted':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'rejected':
        case 'needs revision':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        default:
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
}

export default function SubmissionsTable({ submissions }: Props) {
    const [replaceTarget, setReplaceTarget] = useState<Submission | null>(null);
    const [historyTarget, setHistoryTarget] = useState<Submission | null>(null);
    const [detailTarget, setDetailTarget] = useState<Submission | null>(null);

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
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">ID</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Title</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Name</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Email</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Version</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Status</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Comment</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">Submitted</th>
                                <th className="pb-2 pr-3 font-medium text-muted-foreground">History</th>
                                <th className="pb-2 font-medium text-muted-foreground">Files</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((submission) => (
                                <tr
                                    key={submission.id}
                                    className="cursor-pointer border-b border-sidebar-border/40 transition-colors hover:bg-muted/50 last:border-0"
                                    onClick={() => setDetailTarget(submission)}
                                >
                                    <td className="py-2 pr-3 font-mono text-muted-foreground">
                                        {submission.id}
                                    </td>
                                    <td className="py-2 pr-3">
                                        <span className="max-w-[120px] truncate block">
                                            {submission.title}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 text-muted-foreground">
                                        <span className="max-w-[100px] truncate block">
                                            {submission.name}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 text-muted-foreground">
                                        <span className="max-w-[140px] truncate block">
                                            {submission.email}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 text-muted-foreground">
                                        v{submission.version}
                                    </td>
                                    <td className="py-2 pr-3">
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusVariant(
                                                submission.status,
                                            )}`}
                                        >
                                            {submission.status}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 text-muted-foreground">
                                        <span className="max-w-[120px] truncate block">
                                            {submission.comment ?? '—'}
                                        </span>
                                    </td>
                                    <td className="py-2 text-muted-foreground">
                                        {submission.submitted_at ?? '—'}
                                    </td>
                                    <td className="py-2 pr-3">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 gap-1 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setHistoryTarget(submission);
                                            }}
                                        >
                                            <History className="h-3 w-3" />
                                            {submission.history_count > 0 && (
                                                <span className="text-muted-foreground">
                                                    {submission.history_count}
                                                </span>
                                            )}
                                        </Button>
                                    </td>
                                    <td className="py-2 text-muted-foreground">
                                        {submission.files.length === 0 ? (
                                            <span className="text-muted-foreground">—</span>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <span className="rounded bg-muted px-1 py-0.5 text-xs font-medium">
                                                    {submission.files.length}
                                                </span>
                                                <span className="max-w-[100px] truncate">
                                                    {submission.files.map(f => f.file_name).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {replaceTarget && (
                <ReplaceFileModal
                    open={true}
                    onClose={() => setReplaceTarget(null)}
                    submission={replaceTarget}
                />
            )}

            {historyTarget && (
                <SubmissionHistoryModal
                    open={true}
                    onClose={() => setHistoryTarget(null)}
                    submission={historyTarget}
                />
            )}

            {detailTarget && (
                <SubmissionDetailModal
                    open={true}
                    onClose={() => setDetailTarget(null)}
                    submission={detailTarget}
                    onUploaded={() => setDetailTarget(null)}
                />
            )}
        </div>
    );
}
