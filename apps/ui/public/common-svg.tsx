type IconProps = {
  className?: string
}

export function HamburgerIcon({ onClick, className }: { className?: string; onClick?: React.MouseEventHandler<SVGSVGElement> }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" onClick={onClick} className={className}>
      <path d="M3 12.3332H22M3 5.99988H22M3 18.6665H22" stroke="#1B212E" strokeWidth="2.42448" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


export function CloseBtn({ onClick, className }: { className?: string; onClick?: React.MouseEventHandler<SVGSVGElement> }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none" onClick={onClick} className={className}>
      <path d="M8.16602 20.8351L14.5013 14.4998L20.8366 20.8351M20.8366 8.16455L14.5001 14.4998L8.16602 8.16455" stroke="#1B212E" strokeWidth="1.8125" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


export function MagnifyingSearch({ className }: { className: string }) {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20.125 20.125L15.9658 15.9658" stroke="#000000" strokeWidth="1.45833" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5417 18.2083C14.7759 18.2083 18.2083 14.7759 18.2083 10.5417C18.2083 6.30748 14.7759 2.875 10.5417 2.875C6.30748 2.875 2.875 6.30748 2.875 10.5417C2.875 14.7759 6.30748 18.2083 10.5417 18.2083Z" stroke="#000000" strokeWidth="1.45833" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  )
}

export function Calendar({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className={className}>
      <path d="M11.4707 1.96373C11.389 1.88302 11.2909 1.81889 11.1822 1.77528C11.0735 1.73166 10.9565 1.70947 10.8384 1.71005H9.93274V1.06873C9.93482 0.928078 9.90643 0.788516 9.84934 0.658652C9.79225 0.528789 9.70767 0.411378 9.60081 0.313662C9.49754 0.212613 9.37352 0.132661 9.23637 0.0787348C9.09922 0.0248085 8.95186 -0.00194937 8.80338 0.000110504H8.3521C8.20356 -0.00185267 8.05617 0.0250228 7.91902 0.079079C7.78187 0.133135 7.65787 0.213226 7.55467 0.31441C7.44777 0.412099 7.36317 0.529505 7.30607 0.659375C7.24898 0.789245 7.22062 0.92882 7.22274 1.06948V1.7108H4.51274V1.06873C4.51481 0.928078 4.48643 0.788516 4.42934 0.658652C4.37225 0.528789 4.28766 0.411378 4.1808 0.313662C4.07763 0.212705 3.95373 0.132807 3.81672 0.0788841C3.67972 0.0249609 3.53251 -0.00184681 3.38416 0.000110504H2.93289C2.78434 -0.00185267 2.63695 0.0250228 2.4998 0.079079C2.36265 0.133135 2.23865 0.213226 2.13545 0.31441C2.02859 0.412126 1.94401 0.529537 1.88692 0.659401C1.82983 0.789264 1.80145 0.928826 1.80352 1.06948V1.7108H0.900184C0.782128 1.71022 0.665186 1.73241 0.556485 1.77603C0.447783 1.81964 0.349602 1.88376 0.267929 1.96448C0.182682 2.04182 0.114961 2.13478 0.0688993 2.23771C0.0228373 2.34063 -0.000601975 2.45136 1.05193e-05 2.56315V11.1173C0.00305796 11.3428 0.0987552 11.5584 0.266805 11.7182C0.434854 11.878 0.662039 11.9696 0.900184 11.9734H10.8353C11.0739 11.9703 11.3017 11.8792 11.4704 11.7195C11.6391 11.5597 11.7354 11.344 11.7386 11.1181V2.56539C11.7397 2.45311 11.7164 2.34181 11.6704 2.23834C11.6243 2.13487 11.5563 2.04142 11.4707 1.96373ZM2.93526 11.1173H0.900184V9.19338H2.9321L2.93526 11.1173ZM2.93526 8.76533H0.900184V6.62734H2.9321L2.93526 8.76533ZM2.93526 6.1993H0.900184V4.27533H2.9321L2.93526 6.1993ZM2.77719 3.14236C2.75581 3.12307 2.73882 3.09984 2.72726 3.0741C2.71571 3.04836 2.70984 3.02066 2.71002 2.99269V1.06873C2.71083 1.01221 2.73491 0.958219 2.77712 0.918248C2.81934 0.878278 2.87635 0.855481 2.93605 0.854706H3.38416C3.44385 0.855481 3.50087 0.878278 3.54308 0.918248C3.5853 0.958219 3.60937 1.01221 3.61019 1.06873V2.99344C3.60937 3.04996 3.5853 3.10395 3.54308 3.14392C3.50087 3.18389 3.44385 3.20669 3.38416 3.20746H2.93289C2.90304 3.20769 2.87345 3.2021 2.84599 3.19102C2.81852 3.17995 2.79376 3.16364 2.77324 3.14311L2.77719 3.14236ZM5.64526 11.1166H3.38416V9.19338H5.6421L5.64526 11.1166ZM5.64526 8.76458H3.38416V6.62734H5.6421L5.64526 8.76458ZM5.64526 6.19855H3.38416V4.27533H5.6421L5.64526 6.19855ZM8.35527 11.1158H6.09337V9.19338H8.35131L8.35527 11.1158ZM8.35527 8.76383H6.09337V6.62734H8.35131L8.35527 8.76383ZM8.35527 6.1978H6.09337V4.27533H8.35131L8.35527 6.1978ZM8.1972 3.14086C8.17543 3.12213 8.15789 3.0994 8.14566 3.07406C8.13344 3.04872 8.12677 3.02129 8.12607 2.99344V1.06873C8.12669 1.01215 8.1507 0.958049 8.19296 0.918038C8.23521 0.878027 8.29235 0.855291 8.3521 0.854706H8.80338C8.86313 0.855291 8.92027 0.878027 8.96252 0.918038C9.00478 0.958049 9.02879 1.01215 9.02941 1.06873V2.99344C9.02879 3.05002 9.00478 3.10412 8.96252 3.14413C8.92027 3.18414 8.86313 3.20688 8.80338 3.20746H8.3521C8.32225 3.20774 8.29265 3.20216 8.26518 3.19109C8.2377 3.18001 8.21295 3.16368 8.19246 3.14311L8.1972 3.14086ZM10.84 11.1151H8.80338V9.19338H10.8353L10.84 11.1151ZM10.84 8.76308H8.80338V6.62734H10.8353L10.84 8.76308ZM10.84 6.19705H8.80338V4.27533H10.8353L10.84 6.19705Z" fill="#44525D" />
    </svg>
  )
}


export function PublishedTime() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1088_2076)">
        <path d="M4.66699 1.1665V3.49984" stroke="#4A5565" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.33301 1.1665V3.49984" stroke="#4A5565" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.0833 2.3335H2.91667C2.27233 2.3335 1.75 2.85583 1.75 3.50016V11.6668C1.75 12.3112 2.27233 12.8335 2.91667 12.8335H11.0833C11.7277 12.8335 12.25 12.3112 12.25 11.6668V3.50016C12.25 2.85583 11.7277 2.3335 11.0833 2.3335Z" stroke="#4A5565" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.75 5.8335H12.25" stroke="#4A5565" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1088_2076">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>

  )
}


export function SearchByChevron({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  )
}








export function LinkIcon({ className }: IconProps) {
  return (


    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">

      <g id="SVGRepo_bgCarrier" stroke-width="0" />

      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />

      <g id="SVGRepo_iconCarrier"> <title>Link</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Link"> <rect id="Rectangle" fill-rule="nonzero" x="0" y="0" width="24" height="24"> </rect> <path d="M14,16 L17,16 C19.2091,16 21,14.2091 21,12 L21,12 C21,9.79086 19.2091,8 17,8 L14,8" id="Path" stroke="#0C0310" stroke-width="2" stroke-linecap="round"> </path> <path d="M10,16 L7,16 C4.79086,16 3,14.2091 3,12 L3,12 C3,9.79086 4.79086,8 7,8 L10,8" id="Path" stroke="#0C0310" stroke-width="2" stroke-linecap="round"> </path> <line x1="7.5" y1="12" x2="16.5" y2="12" id="Path" stroke="#0C0310" stroke-width="2" stroke-linecap="round"> </line> </g> </g> </g>

    </svg>
  )
}
