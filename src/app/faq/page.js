import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon } from '../../icons/MinusSmallIcon'
import { PlusSmallIcon } from '../../icons/PlusSmallIcon'

const faqs = [
  {
    question: 'How does the backup work, and what is it exactly?',
    answer:
        "It's all about data availability, referred to as 'replication.' The more peers that have your data, the 'safer' it is. For example, if your device is destroyed, you can use your seed phrase to restore your account and all of its data in a second. Note, your data is encrypted, so no matter who you replicate your data with, they cannot see anything. Obviously, you do not need to trust me; all of this is open-sourced and as transparent as it gets."
  },
  {
    question: 'Can I use the same account in multiple devices?',
    answer:
        'As of now, it is *not* recommended to use the same account in multiple *active* device. Multi-device IDs will be supported soon, though.'
  },
  {
    question: "How 'Vote For Features' work?",
    answer: 'Right now, it is dead-simple. The PeerPass app creates a simple RPC instance for its users, which is used to send votes and feedback directly to one of my nodes. In a perfect world, voting would be based on <a href="https://docs.pears.com/building-blocks/autobase" class="text-indigo-600 underline hover:text-indigo-400 font-semibold" target="_blank">Autobase</a>, but fighting spam is a bit too much work for one dev'
  },
  {
    question: "What's the best thing about Switzerland?",
    answer: "I don't know, but the flag is a big plus."
  }
]

export default function FAQ () {
  return (
    <div>
      {/* Questions Start */}
      <div className='bg-white'>
        <div className=''>
          <div className='mx-auto max-w-4xl divide-y divide-gray-900/10'>
            <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900'>
              Good to know
            </h2>
            <dl className='mt-5 space-y-6 divide-y divide-gray-900/10'>
              {faqs.map((faq) => (
                <Disclosure as='div' key={faq.question} className='pt-6'>
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className='flex w-full items-start justify-between text-left text-gray-900'>
                          <span className='text-base font-semibold leading-7'>
                            {faq.question}
                          </span>
                          <span className='ml-6 flex h-7 items-center'>
                            {open
                              ? (
                                <MinusSmallIcon
                                  className='h-6 w-6'
                                  aria-hidden='true'
                                />
                                )
                              : (
                                <PlusSmallIcon
                                  className='h-6 w-6'
                                  aria-hidden='true'
                                />
                                )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as='dd' className='mt-2 pr-12'>
                        <p
                          className='text-base leading-7 text-gray-600'
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
      {/* Questions End */}
    </div>
  )
}
