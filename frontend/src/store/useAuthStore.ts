import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";
import { doLogin, doRegister } from "@/api/user";
import type { Credential } from "@/types/Credential";

interface AuthStore {
    accessToken: string | null;
    refreshToken: string | null;
    isLogin:boolean;
    user: User | null;
    login:(credential:Credential) => Promise<void>;
    register:(credential:Credential) => Promise<void>;
    updateAccessToken:(token:string) => void;
    logout:() => void;
}

export const useAuthStore = create<AuthStore>()(
    persist((set) => ({
        accessToken:null,
        refreshToken:null,
        isLogin:false,
        user:null,
        login:async (credential) => {
            const response = await doLogin(credential);
            const { user, accessToken, refreshToken } = response.data;
            set({
                accessToken,
                refreshToken,
                isLogin:true,
                user,
            });
        },
        register: async (credential) => {
            const response = await doRegister(credential);
            const { user, accessToken, refreshToken } = response.data;
            set({
                accessToken,
                refreshToken,
                isLogin:true,
                user,
            });
        },
        updateAccessToken:(token) => set({accessToken:token}),
        logout:() => {
            set({
                accessToken:null,
                refreshToken:null,
                isLogin:false,
                user:null,
            });
            localStorage.removeItem('romantic-auth-storage');
        },
    }),
    {
        name:'romantic-auth-storage',
        partialize:(state) => ({
            accessToken:state.accessToken,
            isLogin:state.isLogin,
            refreshToken:state.refreshToken,
            user:state.user,
        }),
    }
 )
)