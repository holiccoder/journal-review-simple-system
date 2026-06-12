import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Student = {
    id: number;
    name: string;
    email: string;
    submission_count: number;
    created_at: string | null;
};

type Props = {
    students: Student[];
};

export default function Students({ students }: Props) {
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleCreate = () => {
        createForm.post('/settings/students', {
            onSuccess: () => {
                setShowCreateForm(false);
                createForm.reset();
                router.reload();
            },
        });
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        editForm.clearErrors();
        editForm.setData({
            name: student.name,
            email: student.email,
            password: '',
            password_confirmation: '',
        });
    };

    const handleUpdate = () => {
        if (!editingStudent) return;
        editForm.patch(`/settings/students/${editingStudent.id}`, {
            onSuccess: () => {
                setEditingStudent(null);
                editForm.reset();
                router.reload();
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/settings/students/${id}`, {
            onSuccess: () => {
                setDeletingId(null);
                router.reload();
            },
        });
    };

    return (
        <>
            <Head title="Students" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Students"
                    description="Manage student accounts"
                />

                {/* Create Student */}
                <div className="space-y-4">
                    {!showCreateForm ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCreateForm(true)}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Student
                        </Button>
                    ) : (
                        <div className="rounded-lg border p-4 space-y-4">
                            <h4 className="text-sm font-medium">
                                Create New Student
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Student name"
                                    />
                                    <InputError
                                        message={createForm.errors.name}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="student@example.com"
                                    />
                                    <InputError
                                        message={createForm.errors.email}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Password"
                                    />
                                    <InputError
                                        message={createForm.errors.password}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={
                                            createForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            createForm.setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    disabled={createForm.processing}
                                    onClick={handleCreate}
                                >
                                    {createForm.processing
                                        ? 'Creating...'
                                        : 'Create'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        createForm.reset();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                    {students.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">
                            No students yet. Add one to get started.
                        </p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-3 pr-3 font-medium text-muted-foreground">
                                        ID
                                    </th>
                                    <th className="pb-3 pr-3 font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="pb-3 pr-3 font-medium text-muted-foreground">
                                        Email
                                    </th>
                                    <th className="pb-3 pr-3 font-medium text-muted-foreground">
                                        Submissions
                                    </th>
                                    <th className="pb-3 pr-3 font-medium text-muted-foreground">
                                        Joined
                                    </th>
                                    <th className="pb-3 font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="py-2 pr-3 font-mono text-muted-foreground">
                                            {student.id}
                                        </td>
                                        <td className="py-2 pr-3 font-medium">
                                            {student.name}
                                        </td>
                                        <td className="py-2 pr-3 text-muted-foreground">
                                            {student.email}
                                        </td>
                                        <td className="py-2 pr-3 font-mono text-muted-foreground">
                                            {student.submission_count}
                                        </td>
                                        <td className="py-2 pr-3 text-muted-foreground">
                                            {student.created_at ?? '—'}
                                        </td>
                                        <td className="py-2">
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    aria-label="Edit"
                                                    onClick={() =>
                                                        handleEdit(student)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                {deletingId === student.id ? (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    student.id,
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                setDeletingId(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        aria-label="Delete"
                                                        onClick={() =>
                                                            setDeletingId(
                                                                student.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog
                open={editingStudent !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingStudent(null);
                        editForm.reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Student</DialogTitle>
                        <DialogDescription>
                            Update the student's name and email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(e) =>
                                    editForm.setData('name', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                            />
                            <InputError message={editForm.errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">
                                Password{' '}
                                <span className="text-muted-foreground">
                                    (leave blank to keep current)
                                </span>
                            </Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) =>
                                    editForm.setData(
                                        'password',
                                        e.target.value,
                                    )
                                }
                                placeholder="New password"
                            />
                            <InputError
                                message={editForm.errors.password}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password-confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="edit-password-confirmation"
                                type="password"
                                value={
                                    editForm.data.password_confirmation
                                }
                                onChange={(e) =>
                                    editForm.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                placeholder="Confirm new password"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setEditingStudent(null);
                                    editForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={editForm.processing}
                                onClick={handleUpdate}
                            >
                                {editForm.processing
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

Students.layout = {
    breadcrumbs: [
        {
            title: 'Students',
            href: '/settings/students',
        },
    ],
};
