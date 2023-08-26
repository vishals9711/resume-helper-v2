import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '../../../../auth'
import { nanoid } from '@/lib/utils'
import { EXTRACT_KEYWORDS_PROMPT, MIGHTY_PROMPT, REWRITE_RESUME_PROMPT } from '@/lib/prompts'

export const runtime = 'edge';
export const EXPERIENCE = `
EXPERIENCE

Full Stack Engineering Intern                                                                                                                	                  Jun 2022 – Jul 2023
Privacera | Fremont, CA
•	Developed full-stack web applications using React, Flask, SQLite, and MongoDB, optimizing customer usage analysis and product recommendations. This iterative enhancement process led to a 20% reduction in support cases, bolstering user satisfaction.
•	Automated project lifecycle operations with Docker and Kubernetes, ensuring seamless deployment. Integration of unit tests into the enhanced CI/CD pipeline reduced Sprint time by 30% on AWS Kubernetes Cluster.
•	Engineered an LLM-powered chatbot integrated with Privacera Docs, Zendesk, and Slack, resulting in a 20% higher initial issue resolution rate and 25% fewer escalations. Improved developer productivity and eased the support team's load.
•	Collaborated closely with cross-functional teams to deliver refined products that aligned with customer demands, enhancing user experiences and satisfaction.
•	Slashed planning time by 50% using JIRA sprint planning, showcasing exceptional project management and organizational skills.
•	Demonstrated expertise in Docker and Kubernetes, streamlining project lifecycle operations and trimming Sprint time by 30% in Linux environments.
•	Designed and implemented a chatbot using LLM, integrated with Slack, reducing average issue resolution time by 30%.
•	Provided strategic guidance based on 3 years of technical expertise, resulting in a 20% uplift in project outcomes; demonstrated leadership in guiding teams to success.

Software Engineer                                                                                                                                                       	Jul 2019 – Jul 2021
Persistent Systems | Goa, India
•	Guided and mentored junior developers, resulting in a 30% increase in code quality and fostering their professional growth, demonstrating strong leadership skills.
•	Led comprehensive code reviews, enforcing best practices for a 25% enhancement in code quality, maintaining industry compliance standards.
•	Collaborated seamlessly with engineers, designers, and product managers, delivering innovative software solutions that exceeded customer expectations and boosted user satisfaction by 15%.
•	Managed end-to-end implementation of a large-scale web application, meeting 90% of project milestones on time and within budget. Guided architectural decisions to ensure technical excellence.
•	Effectively communicated project requirements and progress to stakeholders, maintaining 95% alignment and fostering cross-functional collaboration.
•	Utilized Agile and TDD methodologies to prioritize user stories, execute rigorous testing, and achieve quicker cycles, resulting in higher quality and improved customer satisfaction.
•	Addressed network management challenges, delivering user-friendly solutions that reduced network downtime by 20%, enhancing customer satisfaction.
`

export const TECHNICAL_SKILLS = `

TECHNICAL SKILLS

Languages: Python, SQL, JavaScript, TypeScript, React Native, JAVA, C, C++, NoSQL
Frameworks: React, Redux NodeJS, Flask, JUnit, Material-UI, Redis, MongoDB, FireBase, Docker, Redis, Celery
Platforms: Kafka, AWS (EC2, S3, Redshift), GCP, Azure, Jira, Firebase, IBM Bluemix`

// [{"role":"user","content":"Hi"}]



export async function POST(req: Request) {
  const json = await req.json();

  // console.log(`json : ${JSON.stringify(json)}`)
  const { messages, previewToken, isFirst } = json;


  // console.log(`messages : ${JSON.stringify(messages[0].content)}`)

  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  // if (previewToken) {
  //   console.log(`previewToken : ${previewToken}`)
  //   configuration.apiKey = `${previewToken}`

  //   console.log(`configuration.apiKey : ${JSON.stringify(configuration)}`)
  // }

  const configuration = new Configuration({
    apiKey: previewToken
  })

  const openai = new OpenAIApi(configuration);



  console.log(`isFirst : ${isFirst}`);
  console.log(`messages : ${JSON.stringify(messages)}`)

  if (isFirst) {
    const prompt1 = MIGHTY_PROMPT(messages[0].content, TECHNICAL_SKILLS, EXPERIENCE);
    console.log(`prompt1 : ${prompt1}`)
    // const prompt2 = REWRITE_RESUME_PROMPT(TECHNICAL_SKILLS, EXPERIENCE);

    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt1 }],
      temperature: 0.7,
      stream: true
    });

    // const json1 = await response1.json();
    // const response_message = json1.choices[0].message.content;


    // console.log(`response1 : ${JSON.stringify(json1)}`)

    // const prompt2 = REWRITE_RESUME_PROMPT(TECHNICAL_SKILLS, EXPERIENCE);
    // // Run prompt2 using the combined prompts from prompt1 and REWRITE_RESUME_PROMPT
    // const res = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: prompt1 }, { role: 'system', content: response_message }, { role: 'user', content: prompt2 }],
    //   temperature: 0.7,
    //   stream: true
    // });


    // const res = await openai.createChatCompletion({
    //   model: 'gpt-3.5-turbo',
    //   messages,
    //   temperature: 0.7,
    // })
    const userId = "vishals9711"

    // console.log(`res : ${JSON.stringify(res)}`)
    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        const title = json.messages[0].content.substring(0, 100)
        const id = json.id ?? nanoid()
        const createdAt = Date.now()
        const path = `/chat/${id}`
        const payload = {
          id,
          title,
          userId,
          createdAt,
          path,
          messages: [
            {
              content:prompt1,
              role: 'user'
            },
            {
              content: completion,
              role: 'assistant'
            }
          ]
        }
        // console.log(`payload : ${JSON.stringify(payload)}`)
        await kv.hmset(`chat:${id}`, payload)
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`
        })
      }
    })

    return new StreamingTextResponse(stream)
  }





  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.7,
  })
  const userId = "vishals9711"

  // console.log(`res : ${JSON.stringify(res)}`)
  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      // console.log(`payload : ${JSON.stringify(payload)}`)
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}
