export const API = {
    ACCOUNTS : {
        LOGIN: "/accounts/account-login/",
        SIGNUP: "/accounts/account-signup/",
        ACCOUNTCREDENTIALS: "/accounts/account-credentials-verification/",
        OTPVERIFICATION: "/accounts/account-credentials-otp-verification/",
        FINDACCOUNT: "/accounts/account-forgot-password-find-account/",
        VERIFYACCOUNT: "/accounts/account-forgot-password-verify-account/",
        RESETPASSWORD: "/accounts/account-reset-account-password/",
        FINGERPRINTSCANNERLOGIN: "/accounts/account-fingerprint-login/"
    },
    PROFILE: {
        USERPROFILE: "/profiles/userprofile/",
        ME: "/profiles/me/",
        MEMBER: "/profiles/members/",
        COMPLETEPROFILE: "/profiles/user-profile/complete-profile/",
        MATCHES: "/profiles/matches/",
        SEARCH: "/profiles/search/",
        BASICINFO: "/profiles/user-profile/basic-info/",
        CAREERINFO: "/profiles/user-profile/career-info/",
        ASTRODETAILS: "/profiles/user-profile/astro-detail/",
        ADDITIONALINFO: "/profiles/user-profile/additional-info/",
        HOBBIESLIST: "/profiles/user-profile/hobbies-list/",
        FAMILYDETAILS: "/profiles/user-profile/family-detail/",
        FEATUREDPHOTOLIST: "/profiles/user-profile/featured-images-details/",
        PARTNERPREFERENCEDETAIL: "/profiles/user-profile/partner-preference-detail/",
        PERSONALINFO: "/profiles/user-profile/personal-info/"
    },
    PAYMENTS: {
        RECORDS: "/payments/records/",
        SUBSCRIPTION: "/payments/subscription/"
    },
    PRIVACY: {
        USERSPRIVACY: "/privacy/userprivacy/",
        FOLLOW: "/privacy/follow/",
        FOLLOWERS: "/privacy/followers/",
        FOLLOWING: "/privacy/following/",
        MUTUAL: "/privacy/mutual/",
    },
    CHAT: {
        CONVERSATIONS: "/chat/conversations/",
        MESSAGES: "/chat/messages/",
    },
    NOTIFICATIONS: {
        LIST: "/notifications/",
    },
}