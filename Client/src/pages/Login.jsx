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
import { useLoadUserQuery, useLoginUserMutation, useRegisterUserMutation } from "@/features/authApi"
import { useNavigate } from "react-router-dom"

export function Login() {

    const { refetch } = useLoadUserQuery();
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
    useEffect(() => {
        if (data?.message) {
            toast.success(data?.message || "Signup Successful");
            refetch();
        }
        if (sData?.message) {
            toast.success(sData?.message || "Login Successful");
            refetch();
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
        <div className="
            min-h-screen flex items-center justify-center 
            bg-gradient-to-br from-blue-50 via-white to-blue-100 
            dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
            p-4">

            <div
                className="
                    w-full max-w-sm 
                    backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 
                    shadow-2xl rounded-2xl p-6 border border-white/20 
                    animate-fadeSlide
    "
            >
                <Tabs defaultValue="account">

                    <TabsList className="grid grid-cols-2 rounded-xl shadow-inner bg-gray-100 dark:bg-gray-700 p-1">
                        <TabsTrigger
                            value="account"
                            className="
            data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 
            data-[state=active]:shadow-md 
            transition-all duration-300 rounded-lg
          "
                        >
                            Signup
                        </TabsTrigger>

                        <TabsTrigger
                            value="password"
                            className="
            data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 
            data-[state=active]:shadow-md 
            transition-all duration-300 rounded-lg
          "
                        >
                            Login
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="animate-fadeIn">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                                <CardDescription>
                                    Enter your details to get started.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label>Name</Label>
                                    <Input
                                        name="name"
                                        value={signupInput.name}
                                        onChange={(e) => changeInputHandle(e, "signup")}
                                        type="text"
                                        placeholder="eg. Shivam"
                                        className="inputGlow"
                                        required
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label>Email</Label>
                                    <Input
                                        name="email"
                                        value={signupInput.email}
                                        onChange={(e) => changeInputHandle(e, "signup")}
                                        type="email"
                                        placeholder="eg. mishra@gmail.com"
                                        className="inputGlow"
                                        required
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label>Password</Label>
                                    <Input
                                        name="password"
                                        value={signupInput.password}
                                        onChange={(e) => changeInputHandle(e, "signup")}
                                        type="password"
                                        placeholder="eg. 123456"
                                        className="inputGlow"
                                        required
                                    />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    disabled={isLoading}
                                    onClick={(e) => handleSubmit(e, "signup")}
                                    className="btnPremium w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please Wait
                                        </>
                                    ) : "Signup"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="password" className="animate-fadeIn">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                                <CardDescription>
                                    Enter your email & password to continue.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label>Email</Label>
                                    <Input
                                        name="email"
                                        value={loginInput.email}
                                        onChange={(e) => changeInputHandle(e, "login")}
                                        type="email"
                                        placeholder="eg. sm@gmail.com"
                                        className="inputGlow"
                                        required
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <Label>Password</Label>
                                    <Input
                                        name="password"
                                        value={loginInput.password}
                                        onChange={(e) => changeInputHandle(e, "login")}
                                        type="password"
                                        placeholder="eg. 123456"
                                        className="inputGlow"
                                        required
                                    />
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    disabled={sIsLoading}
                                    onClick={(e) => handleSubmit(e, "login")}
                                    className="btnPremium w-full"
                                >
                                    {sIsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Please Wait
                                        </>
                                    ) : "Login"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>

    )
}
