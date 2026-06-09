import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import loginRoute from '@/routes/login';
import registerRoute from '@/routes/register';

export default function Welcome() {
    const { auth } = usePage().props;
    const [showRegister, setShowRegister] = useState(false);

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                <header className="w-full border-b border-gray-200 px-6 py-4 dark:border-gray-800 lg:px-8">
                    <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                        <h1 className="text-base font-semibold tracking-tight">
                            Manuscript and Project Review System
                        </h1>
                        <div className="flex items-center gap-2">
                            <img
                                src="/favicon.png"
                                alt="Logo"
                                className="h-5 w-5"
                            />
                            <span className="text-sm font-medium">
                                Shui Teacher Research Training
                            </span>
                        </div>
                    </div>
                </header>
                <div className="flex w-full flex-1 items-center justify-center p-6 opacity-100 transition-opacity duration-750 lg:p-8 starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col lg:max-w-4xl">
                        {!auth.user && (
                            <div className="w-full max-w-md mx-auto">
                                {!showRegister ? (
                                    /* Login Form */
                                    <div className="rounded-lg bg-white p-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:p-8 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                        <h2 className="mb-6 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Log in
                                        </h2>
                                        <Form
                                            {...loginRoute.store.form()}
                                            resetOnSuccess={['password']}
                                            className="flex flex-col gap-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="login-email">
                                                            Email address
                                                        </Label>
                                                        <Input
                                                            id="login-email"
                                                            type="email"
                                                            name="email"
                                                            required
                                                            autoComplete="email"
                                                            placeholder="email@example.com"
                                                        />
                                                        <InputError message={errors.email} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="login-password">
                                                            Password
                                                        </Label>
                                                        <PasswordInput
                                                            id="login-password"
                                                            name="password"
                                                            required
                                                            autoComplete="current-password"
                                                            placeholder="Password"
                                                        />
                                                        <InputError message={errors.password} />
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id="login-remember"
                                                            name="remember"
                                                            defaultChecked
                                                        />
                                                        <Label htmlFor="login-remember">
                                                            Remember me
                                                        </Label>
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        disabled={processing}
                                                    >
                                                        {processing && <Spinner />}
                                                        Log in
                                                    </Button>

                                                    <div className="text-center text-sm text-muted-foreground">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowRegister(true)}
                                                            className="hover:text-[#1b1b18] dark:hover:text-[#EDEDEC] underline underline-offset-4"
                                                        >
                                                            No Account?
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    </div>
                                ) : (
                                    /* Register Form */
                                    <div className="rounded-lg bg-white p-6 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:p-8 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                        <div className="mb-6 flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowRegister(false)}
                                                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                        <h2 className="mb-6 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                            Create an account
                                        </h2>
                                        <Form
                                            {...registerRoute.store.form()}
                                            resetOnSuccess={[
                                                'password',
                                                'password_confirmation',
                                            ]}
                                            disableWhileProcessing
                                            className="flex flex-col gap-4"
                                        >
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="register-name">
                                                            Name
                                                        </Label>
                                                        <Input
                                                            id="register-name"
                                                            type="text"
                                                            name="name"
                                                            required
                                                            autoComplete="name"
                                                            placeholder="Full name"
                                                        />
                                                        <InputError message={errors.name} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="register-email">
                                                            Email address
                                                        </Label>
                                                        <Input
                                                            id="register-email"
                                                            type="email"
                                                            name="email"
                                                            required
                                                            autoComplete="email"
                                                            placeholder="email@example.com"
                                                        />
                                                        <InputError message={errors.email} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="register-password">
                                                            Password
                                                        </Label>
                                                        <PasswordInput
                                                            id="register-password"
                                                            name="password"
                                                            required
                                                            autoComplete="new-password"
                                                            placeholder="Password"
                                                        />
                                                        <InputError message={errors.password} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="register-password-confirmation">
                                                            Confirm password
                                                        </Label>
                                                        <PasswordInput
                                                            id="register-password-confirmation"
                                                            name="password_confirmation"
                                                            required
                                                            autoComplete="new-password"
                                                            placeholder="Confirm password"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.password_confirmation
                                                            }
                                                        />
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        disabled={processing}
                                                    >
                                                        {processing && <Spinner />}
                                                        Create account
                                                    </Button>
                                                </>
                                            )}
                                        </Form>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
                <footer className="w-full border-t border-gray-200 px-6 py-4 dark:border-gray-800 lg:px-8">
                    <p className="text-center text-sm text-muted-foreground">
                        Shui Teacher Research Training
                    </p>
                </footer>
            </div>
        </>
    );
}
