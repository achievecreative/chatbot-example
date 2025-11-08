import "./setup-env"

import contentProvider from "../libs/contents"

import vectorProvider from "../libs/vectors"

async function execute(): Promise<void> {
      const contents = await contentProvider.getContents()

      if (contents) {
        const embedContents = contents.map((content) => ({
          key: content.key,
          message: `${content.summary}\n\n${content.content}`,
          metadata: content.metadata,
        }))

        await vectorProvider.reset()

        await vectorProvider.upsert(embedContents)
      }
}

execute()
  .then(() => process.exit(0))
  .catch((error) => console.error(error))
