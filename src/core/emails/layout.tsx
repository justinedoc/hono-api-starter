/** @jsxImportSource react */

import type * as React from "react";
import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	pixelBasedPreset,
	Section,
	Tailwind,
	Text,
} from "react-email";

type EmailLayoutProps = {
	children: React.ReactNode;
	previewText: string;
};

export const EmailLayout = ({ children, previewText }: EmailLayoutProps) => {
	return (
		<Tailwind
			config={{
				presets: [pixelBasedPreset],
				theme: {
					extend: {
						colors: {
							brand: "#007291",
						},
					},
				},
			}}
		>
			<Html>
				<Head />
				<Preview>{previewText}</Preview>
				<Body className="bg-zinc-100 font-sans">
					<Container className="mx-auto my-[40px] w-full max-w-[600px] rounded-lg border border-solid border-zinc-200 bg-white py-[20px] pb-[48px]">
						{/* Header */}
						<Section className="mt-[24px] px-[40px]">
							<Img
								src="https://logoipsum.com/artwork/427"
								width="40"
								height="40"
								alt="Ventix"
								className="block"
							/>
						</Section>

						{/* Main Content */}
						<Section className="px-[40px] py-[24px]">{children}</Section>

						{/* Footer */}
						<Hr className="mx-0 mt-[32px] w-full border border-solid border-zinc-200" />
						<Section className="mt-[24px] px-[40px]">
							<Text className="m-0 text-[12px] text-zinc-500">
								© 2026 Ventix. All rights reserved.
							</Text>
							<Text className="m-0 mt-[4px] text-[12px] text-zinc-500">
								Owerri, Nigeria
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};
