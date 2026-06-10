import { Download, History } from 'lucide-react';
import { truncateTitle } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type HistoryEntry = {
    id: number;
    file_name: string;
    status: string;
    comment: string | null;
    submitted_at: string | null;
    download_url: string;
};

type FileEntry = {
    id: number;
    file_name: string;
};

type Submission = {
    id: number;
    title: string;
    files: FileEntry[];
    histories: HistoryEntry[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    submission: Submission;
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

export default function SubmissionHistoryModal({ open, onClose, submission }: Props) {
    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-sm">
                        <History className="h-4 w-4 text-muted-foreground" />
                        Submission History
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Previous versions of{' '}
                        <span className="font-medium text-foreground">
                            {truncateTitle(submission.title)}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {submission.histories.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">
                            No history records yet. Previous versions will appear here after replacing a file.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-sidebar-border/70">
                                    <th className="pb-2 pr-3 font-medium text-muted-foreground">File</th>
                                    <th className="pb-2 pr-3 font-medium text-muted-foreground">Status</th>
                                    <th className="pb-2 pr-3 font-medium text-muted-foreground">Comment</th>
                                    <th className="pb-2 pr-3 font-medium text-muted-foreground">Submitted</th>
                                    <th className="pb-2 font-medium text-muted-foreground"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {submission.histories.map((entry) => (
                                    <tr
                                        key={entry.id}
                                        className="border-b border-sidebar-border/40 last:border-0"
                                    >
                                        <td className="py-2 pr-3">
                                            <span className="max-w-[180px] truncate block">
                                                {entry.file_name}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3">
                                            <span
                                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusVariant(
                                                    entry.status,
                                                )}`}
                                            >
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3 text-muted-foreground">
                                            <span className="max-w-[120px] truncate block">
                                                {entry.comment ?? '—'}
                                            </span>
                                        </td>
                                        <td className="py-2 pr-3 text-muted-foreground">
                                            {entry.submitted_at ?? '—'}
                                        </td>
                                        <td className="py-2 text-right">
                                            <a href={entry.download_url}>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    title="Download this version"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </Button>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
