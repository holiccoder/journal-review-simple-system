import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { truncateTitle } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    open: boolean;
    onClose: () => void;
    submission: {
        id: number;
        title: string;
        delete_url: string;
    };
};

export default function DeleteConfirmModal({ open, onClose, submission }: Props) {
    const handleDelete = () => {
        router.delete(submission.delete_url, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        Delete Submission
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Are you sure you want to delete{' '}
                        <span className="font-medium text-foreground">
                            {truncateTitle(submission.title)}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="text-sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
