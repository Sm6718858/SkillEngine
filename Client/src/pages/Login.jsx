import { AppWindowIcon, CodeIcon, Loader2, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/authApi"
import { useNavigate } from "react-router-dom"

export function Login() {

    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });
    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: ""
    });
    //-----------------------------------------------------------

    //RTK query hooks
    const [registerUser, { data, error, isLoading }] = useRegisterUserMutation();
    const [loginUser, { data: sData, error: sError, isLoading: sIsLoading }]
        = useLoginUserMutation();
    //---------------------------------------------------------

    const changeInputHandle = (e, type) => {
        const { name, value } = e.target;
        if (type === "login") {
            setLoginInput({ ...loginInput, [name]: value });
        }
        else {
            setSignupInput({ ...signupInput, [name]: value });
        }
    }

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        const inputData = type === "login" ? loginInput : signupInput;
        const action = type === "login" ? loginUser : registerUser;
        await action(inputData);
    }

    const navigate = useNavigate();
    //Toaster
    useEffect(() => {
        if (data?.message) {
            toast.success(data?.message || "Signup Successful");
        }
        if (sData?.message) {
            toast.success(sData?.message || "Login Successful");
            navigate('/');
        }
        if (error?.data?.message) {
            toast.error(error.data.message);
        }
        if (sError?.data?.message) {
            toast.error(sError.data.message);
        }
    }, [data, sData, error, sError]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue="account">
                    <TabsList>
                        <TabsTrigger value="account">Signup</TabsTrigger>
                        <TabsTrigger value="password">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Signup</CardTitle>
                                <CardDescription>
                                    Create your account by entering the information below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">Name</Label>
                                    <Input name="name" value={signupInput.name} onChange={(e) => changeInputHandle(e, "signup")} type="text" placeholder="eg.Shivam" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Email</Label>
                                    <Input name="email" value={signupInput.email} onChange={(e) => changeInputHandle(e, "signup")} type="email" placeholder="eg.mishra@gmail.com" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Password</Label>
                                    <Input name="password" value={signupInput.password} onChange={(e) => changeInputHandle(e, "signup")} type="password" placeholder="eg.12456" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={isLoading} onClick={(e) => handleSubmit(e, "signup")}>{
                                    isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please Wait

                                        </>
                                    ) : 'Signup'
                                }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login via entering your email and password below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-current">Email</Label>
                                    <Input name="email" value={loginInput.email} onChange={(e) => changeInputHandle(e, "login")} type="email" placeholder="eg. sm@gmail.com" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-new">Password</Label>
                                    <Input name="password" value={loginInput.password} onChange={(e) => changeInputHandle(e, "login")} type="password" placeholder="eg. 12456" required />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={sIsLoading} onClick={(e) => handleSubmit(e, "login")}>{
                                    sIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please Wait

                                        </>
                                    ) : 'Login'}

                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
